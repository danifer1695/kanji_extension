import { kanji_color } from "./styles.js";
import { db_contains_kanji } from "./db.js";
import { STYLES } from "./styles.js";
import { api_request } from "./db.js";

//This script takes care of all rendering to HTML
//function to switch active palette (in shared/constants.js)

export async function render_entries(kanji_data)
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
                            <div>
                                <b style="color: var(--text-muted); font-weight: 800;">Onyomi:</b> 
                                <b>${kanji_data.on_readings.join(", ") || "-"}</b>
                            </div>
                            <div>
                                <b style="color: var(--text-muted); font-weight: 800;">Kunyomi:</b> 
                                <b>${kanji_data.kun_readings.join(", ") || "-"}</b>
                            </div>
                            <div>
                                <b style="color: var(--text-muted); font-weight: 800;">Meanings:</b> 
                                <b>${kanji_data.meanings.join(", ") || "-"}</b>
                            </div>
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

//returns a string of star icons matching a give kanji's mastery level
export async function render_mastery_rating(kanji, max_level = 8)
{
    //max level is hardcoded to 8 on the back end, we will include it as an
    //argument just in case it ever changes

    //send request for kanji's mastery level
    const res = await api_request("GET", `/kanji/mastery?kanji=${encodeURIComponent(kanji)}`);

    //check for bad responses (null return from api_request)
    if(!res) return "???";

    //extract mastery level from json
    const { mastery_level } = await res.json();

    const full = "★";
    const empty = "☆";

    return full.repeat(mastery_level) + empty.repeat(max_level - mastery_level);
}

//This function will make sure that the panel spawns within range
export function correct_position(panel, x, y)
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
