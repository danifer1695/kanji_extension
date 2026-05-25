//This script takes care of all rendering to HTML

//function to switch active palette (in shared/constants.js)
function setPalette(name) {
  if (!PALETTES[name]) {
    console.warn(`Palette "${name}" not found.`);
    return;
  }
  active_palette = name;
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

//This function sets the colors of the kanji boxes depending on their jlpt level
function kanji_color(kanji_jlpt)
{
    switch(kanji_jlpt) {
        case 5: return {fg: COLORS.N5_FG,bg: COLORS.N5_BG};
        case 4: return {fg: COLORS.N4_FG,bg: COLORS.N4_BG};
        case 3: return {fg: COLORS.N3_FG,bg: COLORS.N3_BG};
        case 2: return {fg: COLORS.N2_FG,bg: COLORS.N2_BG};       
        case 1: return {fg: COLORS.N1_FG,bg: COLORS.N1_BG}; 
        default: return {fg: COLORS.NX_FG,bg: COLORS.NX_BG};
    }
}


//This function will make sure that the panel spawns within range
function correct_position(panel, x, y)
{
    //get bounding box
    const rect = panel.getBoundingClientRect();
    
    if(rect.right > window.innerWidth)
    {
        panel.style.left = `${x - rect.width - 10}px`;
    }
    
    if(rect.bottom > window.innerHeight)
    {
        panel.style.top = `${y - rect.height - 10}px`;
    }
}
