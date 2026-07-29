import { get_token } from "../shared/auth.js";
import { load_palette } from "../shared/palette.js";
import { correct_position } from "../shared/helpers_render.js";
import { save_kanji, db_contains_kanji } from "../shared/db.js";
import { get_kanji_data } from "../shared/api.js"
import { kanji_color, STYLES } from "../shared/styles.js";


//Shadow DOM--------------------------------------------------------------

//We want to isolate this panel from the host page's environment so
//our logic and styling does not affect it.
const shadow_host = document.createElement("div");
shadow_host.id = "shirabeyou_shadow_host";
document.body.appendChild(shadow_host);

//Attach a shadow root.
const shadow = shadow_host.attachShadow({mode: "closed"});

const panel = create_panel();
shadow.appendChild(panel);

//user-selected kanji entry within the lookup panel
let selected_entry = null; 

//Fonts-------------------------------------------------------------------

//We inject our font into the document's head
async function inject_font()
{
    const font_url = chrome.runtime.getURL("fonts/NotoSansJP-VariableFont_wght.ttf");
    const font = new FontFace(
        "Shirabeyou Noto",
        `url(${font_url}) format('truetype-variations')`,
        { weight: "100 900" }
    );

    //force font to be loaded on boot, otherwise it will load dynamically
    //once the panel is first called, showing the wrong font fro a few 
    //milliseconds, which is kind of jarring.
    document.fonts.add(font);
    await font.load();
}

//inject lookup panel's stylesheets to the shadow dom.
async function inject_shadow_styles() 
{
    const urls = [
        chrome.runtime.getURL("styles/styles.css"),
        chrome.runtime.getURL("styles/lookup_panel.css"),
    ];

    const sheets = await Promise.all(
        urls.map(url => fetch(url).then(res => res.text()))
    );

    for(const css of sheets)
    {
        const style = document.createElement("style");
        style.textContent = css;
        shadow.appendChild(style);
    }
};

//Panel-------------------------------------------------------------------

//Inject panel element into the document's HTML
function create_panel()
{
    const panel = document.createElement("div");
    panel.id = "shirabeyou-lookup-panel";    
    panel.style.display = "none";
    return panel;
}

function hide_panel()
{
    panel.style.display = "none";
    selected_entry = null;
}

async function create_entry_HTML(kanji_chars)
{
    let HTML = "";

    //We concatenate information on each of the kanji within the selection, one after another
    for (const kanji of kanji_chars)
    {
        //Integrate error handling in case api is down
        try {
            //Send request to kanjiapi.dev's API
            const kanji_data = await get_kanji_data(kanji);

            //We get the kanji's grade to color its box accordingly
            const kanji_jlpt = kanji_data.jlpt;
            const {fg, bg} = kanji_color(kanji_jlpt);

            //Confirm whether the kanji already exists in the user's library or not
            const button_icon = await db_contains_kanji(kanji_data.kanji) ? "✓" : "+";

            HTML += `
            <div class="lookup-result-outline">
                <div class="lookup-result-panel">
                    <div class="lookup-kanji-container" style="${STYLES.kanji_container}"> 
                        <div class="kanji" 
                            data-fg="${fg}"
                            data-bg="${bg}"
                            style="${STYLES.kanji_idle(fg, bg)}">
                            ${kanji_data.kanji}
                        </div>
                        <div class="lookup-kanji-info">
                            <div>
                                <b style="color: var(--text-muted);">Onyomi:</b> 
                                <b style="font-weight: 600">${kanji_data.on_readings.join(", ") || "-"}</b>
                            </div>
                            <div>
                                <b style="color: var(--text-muted);">Kunyomi:</b> 
                                <b style="font-weight: 600">${kanji_data.kun_readings.join(", ") || "-"}</b>
                            </div>
                            <div>
                                <b style="color: var(--text-muted);">Meanings:</b> 
                                <b style="font-weight: 600">${kanji_data.meanings.join(", ") || "-"}</b>
                            </div>
                        </div>
                    </div>
                    <div class="btn-add btn-add-idle"
                        data-kanji='${JSON.stringify(kanji_data)}'>
                        ${button_icon}
                    </div>
                </div>
            </div>
        `;
        }
        catch (e) {
            console.error(`Failed to fetch kanji: ${kanji}`, e);
            HTML += `<div>Could not load data for ${kanji}</div>`;

        }
    }        

    return HTML;
}

async function spawn_panel(e)
{
    //check connection first, dont spawn if 
    //user is not connnected
    const token = await get_token();
    if(!token) return;

    //dont close panel if user clicks inside of it.
    if(shadow_host.contains(e.target)){
        //console.log("clicked inside panel");
        return;
    } 
    //get text selection, trim it, and keep only 
    //kanji characters
    const raw = window.getSelection().toString().trim();
    const selected = [...raw].filter(c => c.match(/[\u4e00-\u9fff]/));

    //hide panel if selection is 0 chars long
    if(selected.length === 0)
    {
        hide_panel();
        return;
    }

    //Apply active color theme
    const palette = await load_palette();
    shadow_host.className = `theme-${palette}`;

    //Adjust position of the panel
    panel.style.left = `${e.clientX + 10}px`;
    panel.style.top = `${e.clientY + 10}px`;

    //Display panel, show placeholder content while actual content loads
    panel.style.display = "block";
    panel.textContent = "Loading...";

    panel.innerHTML = await create_entry_HTML(selected);

    //Correct position of panel in case it appears out of screen
    //Wait for browser to render before measuring
    setTimeout(() => { 
        correct_position(panel, e.clientX, e.clientY);    
    }, 0);
}

//Events------------------------------------------------------------------

//Attached once on startup.
//Listeners are attached to the panel, kanji items are not stable.
function init_panel_events()
{
    //Highlight events
    panel.addEventListener("mouseover", (e) => {
        const row = e.target.closest(".lookup-result-outline");
        if(!row) return;

        if(selected_entry !== row) row.style.background = "var(--border-hover)";

        const btn = row.querySelector(".btn-add");
        //Do not stomp on a button that has already been used to save.
        if(btn && !btn.classList.contains("btn-add-selected"))
        {
            btn.className = "btn-add btn-add-hovered";
        }
    });

    //Un-hover events
    panel.addEventListener("mouseout", (e) => {
        const row = e.target.closest(".lookup-result-outline");
        if(!row) return;

        //ignore moves between children of the same row.
        if(row.contains(e.relatedTarget)) return;

        if(selected_entry !== row) row.style.background = "var(--border-idle)"
        const btn = row.querySelector(".btn-add");

        //set button to idle if it is not tagged as selected
        if(btn && !btn.classList.contains("btn-add-selected"))
        {
            btn.className = "btn-add btn-add-idle";
        }
    });

    //click events
    panel.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btn-add");
        if(btn)
        {
            e.stopPropagation();

            const data = JSON.parse(btn.dataset.kanji);
            await save_kanji(data);

            btn.textContent = "✓";
            return;
        }

        const row = e.target.closest(".lookup-result-outline");
        if(!row) return;

        //deselect whatever was selected before.
        if(selected_entry && selected_entry !== row)
        {
            selected_entry.style.background = "var(--border-idle)";
            selected_entry.querySelector(".lookup-result-panel")
                .style.background = "var(--bg-idle-00)";
        }

        row.style.background = "var(--border-hover)";
        //row.querySelector(".lookup-result-panel").style.background = "var(--bg-selected)";

        selected_entry = row;
    });
}

//Startup-----------------------------------------------------------------

init_panel_events();

inject_shadow_styles().then(async () => {
    //console.log("Mouse Up!")
    await inject_font();
    document.addEventListener("mouseup", async (e) => {
        /*Space for debugging*/
        await spawn_panel(e);
    });
})
