//Create the panel element
//this creates an element of type 'div'

const panel = create_panel();
let selected_entry = null;            //this holds a user-selected entry 
document.body.appendChild(panel);

//Append elements to the document----------------------------------------------------------------
//Add the font to the page's header
const fontStyle = document.createElement("style");
fontStyle.textContent = `
  @font-face {
    font-family: 'Noto Sans JP';
    src: url(chrome-extension://__MSG_@@extension_id__/fonts/NotoSansJP-VariableFont_wght.ttf) format('truetype');
    font-weight: 100 900;
    font-style: normal;
  }
`;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("shared/styles.css");

document.head.appendChild(link);
document.head.appendChild(fontStyle);
//-----------------------------------------------------------------------------------------------


//make the pop up show when kanji is selected
document.addEventListener("mouseup", spawn_panel);

//Spawn the popup panel
async function spawn_panel(e)
{
    //If there is no auth token, we exit early
    const token  = await get_token();
    if(!token) return;

    //If click was inside the panel, we do nothing and exit
    if(panel.contains(e.target)) return;

    //Get raw string within selected text
    const raw = window.getSelection().toString().trim();
    
    //we filter out all characters that are outside of the kanji's unix range 
    const selected = [...raw].filter(c => c.match(/[\u4e00-\u9fff]/));
    if (selected.length > 0 ) 
    {
        //e.clientX gets the user's cursor's x coordinates relative to the viewport
        panel.style.left = `${e.clientX + 10}px`;
        panel.style.top = `${e.clientY + 10}px`;

        //First we set the text to say 'loading' so it displays this while the api searches
        panel.style.display = "block";
        panel.textContent = "Loading...";
        panel.innerHTML = await lookup_word(selected);

        //Correct position of panel in case it appears out of screen
        //Wait for browser to render before measuring
        setTimeout(() => { 
            correct_position(panel, e.clientX, e.clientY);    
        }, 0);
        
        //insert event listeners to the newly created entries within the panel
        insert_event_listeners(panel);
    } 
    else 
    {
        panel.style.display = "none";
    }
    
}


//Event listeners--------------------------------------------------------------------
//This function takes care of injecting event triggers into HTML classes
function insert_event_listeners(panel)
{
    //"add_button" class members
    const buttons = panel.querySelectorAll(".btn-add-idle");
    buttons.forEach(btn => {

        //-------------mouseenter----------------------
        btn.addEventListener("mouseenter", () => {
            btn.className = "btn-add-hovered";
       });
        //-------------mouseleave----------------------
        btn.addEventListener("mouseleave", () => {
            btn.className = "btn-add-hovered";
       });
        //-------------buttonDatabaseLogic----------------------
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const data = JSON.parse(btn.dataset.kanji); //access HTML's "data-kanji"
            await save_kanji(data);     //from db.js

            btn.className = "btn-add-selected"
            btn.textContent = "✓";
        });
    });

    //"result_outline" class members
    const rows = panel.querySelectorAll(".lookup-result-outline");
    rows.forEach(row => {
        //Get contained button
        const button = row.querySelector("#btn-add");
        const result_panel = row.querySelector(".lookup-result-panel");

        //-------------mouseenter----------------------
        row.addEventListener("mouseenter", () => {
            if(selected_entry !== row) row.style.background = "var(--border-hover)";
            //Also change its contained buttons
            button.className = "btn-add-hovered";
        });

        //-------------mouseleave----------------------
        row.addEventListener("mouseleave", () => {
            if(selected_entry !== row) row.style.background = "var(--border-idle)";
            button.className = "btn-add-idle";
        });

        //-------------click---------------------------
        row.addEventListener("click", (e) => {

            if (selected_entry && selected_entry !== row) {
                selected_entry.style.background = "var(--border-idle)";
                selected_entry.querySelector(".lookup-result-panel").style.background = "var(--bg-idle-00)";
            }

            row.style.background = `linear-gradient(to bottom, var(--gradient-top), var(--gradient-bottom)`;
            result_panel.style.background = "var(--bg-selected)";

            selected_entry = row;
        });
    });
}

//This function creates the main panel that will contain all the request results
function create_panel()
{
    const panel = document.createElement("div");
    //z-index: 99999 makes sure the panel renders on top of everything
    panel.className = "lookup-panel";    

    panel.style.display = "none";
    
    return panel;
}

async function render_entries(kanji_data)
{
    //We get the kanji's grade to color its box accordingly
    const kanji_jlpt = kanji_data.jlpt;
    const {fg, bg} = kanji_color(kanji_jlpt);
    const button_icon = await db_contains_kanji(kanji_data.kanji) ? "✓" : "+";

    let HTML = `
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
                            <div><b>Onyomi:</b> ${kanji_data.on_readings.join(", ") || "-"}</div>
                            <div><b>Kunyomi:</b> ${kanji_data.kun_readings.join(", ") || "-"}</div>
                            <div><b>Meanings:</b> ${kanji_data.meanings.join(", ")}</div>
                        </div>
                    </div>
                    <div id="btn-add" class="btn-add-idle"
                        data-kanji='${JSON.stringify(kanji_data)}'>
                        ${button_icon}
                    </div>
                </div>
            </div>
        `;

    return HTML;
}
