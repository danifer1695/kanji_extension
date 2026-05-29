//Create the panel element
//this creates an element of type 'div'

const panel = create_panel();
let selected_entry = null;            //this holds a user-selected entry 
document.body.appendChild(panel);

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
document.head.appendChild(fontStyle);

//make the pop up show when kanji is selected
document.addEventListener("mouseup", spawn_panel);

//This function takes care of spawning the panel on triggered
async function spawn_panel(e)
{
    //If click was inside the panel, we do nothing and exit
    if(panel.contains(e.target)) return;

    //Get raw string within selected text
    const raw = window.getSelection().toString().trim();
    
    //using [...x] we filter out all characters that are outside of the kanji's unix range 
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


//This function takes care of injecting event triggers into HTML classes
function insert_event_listeners(panel)
{
    //========================================================
    //"add_button" class members
    //========================================================
    const buttons = panel.querySelectorAll(".add_button");
    buttons.forEach(btn => {

        //-------------mouseenter----------------------
        btn.addEventListener("mouseenter", () => {
            btn.style = STYLES.add_button_hovered(COLORS.gradient_top, COLORS.gradient_bottom);
       });
        //-------------mouseleave----------------------
        btn.addEventListener("mouseleave", () => {
            btn.style = STYLES.add_button_idle(COLORS.bg_idle_00, COLORS.border_idle);
       });
        //-------------buttonDatabaseLogic----------------------
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const data = JSON.parse(btn.dataset.kanji); //access HTML's "data-kanji"
            await save_kanji(data);     //from db.js

            btn.textContent = "✓";
        });
    });

    //========================================================
    //"result_outline" class members
    //========================================================
    const rows = panel.querySelectorAll(".result_outline");
    rows.forEach(row => {
        //Get contained button
        const button = row.querySelector(".add_button");
        const result_panel = row.querySelector(".result_panel");

        //-------------mouseenter----------------------
        row.addEventListener("mouseenter", () => {
            if(selected_entry !== row) row.style.background = COLORS.border_hover;
            //Also change its contained buttons
            button.style.boxShadow = `inset 0 0 0 2px ${COLORS.border_hover}`;
            button.style.color = COLORS.border_hover;
        });

        //-------------mouseleave----------------------
        row.addEventListener("mouseleave", () => {
            if(selected_entry !== row) row.style.background = COLORS.border_idle;

            button.style.boxShadow = `inset 0 0 0 2px ${COLORS.border_idle}`;
            button.style.color = COLORS.border_idle;
        });

        //-------------click---------------------------
        row.addEventListener("click", (e) => {

            if (selected_entry && selected_entry !== row) {
                selected_entry.style.background = COLORS.border_idle;
                selected_entry.querySelector(".result_panel").style.background = COLORS.bg_idle_00;
                selected_entry.querySelector(".add_button").style.background = COLORS.bg_idle_00;
            }

            row.style.background = `linear-gradient(to bottom, ${COLORS.gradient_top}, ${COLORS.gradient_bottom})`;
            result_panel.style.background = COLORS.bg_selected;
            button.style.background = COLORS.bg_selected;

            selected_entry = row;
        });
    });
}

//This function creates the main panel that will contain all the request results
function create_panel()
{
    const panel = document.createElement("div");
    //z-index: 99999 makes sure the panel renders on top of everything
    panel.style = STYLES.panel_idle(COLORS.bg_idle_00);    

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
            <div class="result_outline" 
                style="${STYLES.result_outline(COLORS.border_idle)}">
                <div class="result_panel" style="${STYLES.result_panel(COLORS.bg_idle_00)}">
                    <div class="kanji_container" style="${STYLES.kanji_container}"> 
                        <div class="kanji" 
                            data-fg="${fg}"
                            data-bg="${bg}"
                            style="${STYLES.kanji_idle(fg, bg)}">
                            ${kanji_data.kanji}
                        </div>
                        <div class="kanji_info" style="${STYLES.kanji_info}">
                            <div><b>Onyomi:</b> ${kanji_data.on_readings.join(", ") || "-"}</div>
                            <div><b>Kunyomi:</b> ${kanji_data.kun_readings.join(", ") || "-"}</div>
                            <div><b>Meanings:</b> ${kanji_data.meanings.join(", ")}</div>
                        </div>
                    </div>
                    <div class="add_button"
                        data-kanji='${JSON.stringify(kanji_data)}' 
                        style="${STYLES.add_button_idle(COLORS.bg_idle, COLORS.border_idle)}">
                        ${button_icon}
                    </div>
                </div>
            </div>
        `;

    return HTML;
}