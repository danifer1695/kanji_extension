//Everything owned by the collection tab: the kanji grid, the floating panel
//that opens when the user clicks on a kanji badge, the search box, the sorting
//buttons...

import { check_connection, 
    get_kanji_data,
    get_kanji_from_reading,
} from "../shared/api.js";
import { 
    get_all_kanji,
    get_db_size,
    remove_kanji,
} from "../shared/db.js";
import { STYLES, kanji_color } from "../shared/styles.js";
import { correct_position } from "../shared/helpers_render.js";

//Elements--------------------------------------------------

const collection_container =        document.getElementById("kanji-grid");
const collection_sort_old_btn =     document.getElementById("sort-old");
const collection_sort_jlpt_btn =    document.getElementById("sort-jlpt");
const collection_db_size =          document.getElementById("collection-db-size");
const collection_searchbox =        document.getElementById("collection-footer-searchbox");

//Floating kanji card (containing detailed info on a selected kanji)
const kanji_card_data = document.createElement("div");
kanji_card_data.className = "collection-card-data";
kanji_card_data.style.display = "none";      //hide right away
document.body.appendChild(kanji_card_data);

//Grid rendering--------------------------------------------

//build the kanji grid's HTML
function get_grid_HTML(list)
{
    return list.map(k => {
        const {fg, bg} = kanji_color(k.jlpt);
        return `
        <div  
            class="kanji-card" 
            data-char="${k.kanji}" 
            style="${STYLES.kanji_idle(fg, bg)}; cursor: pointer;
        ">
            ${k.kanji}
        </div>
        `;
    }).join("");
}

//Print a big message in place of the grid.
function display_big_message(message)
{
    collection_container.style.display = "flex";
    collection_container.innerHTML = 
        `<p id="no_results" class="collection-text-warnings">${message}</p>`;
}

//Draw the kanji collection. This function can be called repeated times, 
//no event attaching happens here. 
//Sorting keywords:
//'d' - newest first (default)
//'l' - by JLPT level
//'x' - unsorted (insertion order)
async function render_grid(sorting = 'd')
{
    const saved = await get_all_kanji(); //from db.js
    const entries = Object.values(saved);

    //if collection is empty, display message and return
    if (entries.length == 0) {
        display_big_message("No kanji saved yet");
        return;
    }

    switch(sorting)
    {
        //By jlpt level
        case 'l':
            entries.sort((a, b) => b.jlpt - a.jlpt);
            break;

        //By date of entry (newest first)
        case 'd':
            entries.sort((a, b) => b.saved_at - a.saved_at);
            break;

        //No sorting
        case 'x':
        default:
            break;
    }

    //Render kanji grid
    collection_container.style.display = "grid";
    collection_container.innerHTML = get_grid_HTML(entries);
}

//refresh the kanji coutner below the tab title
async function refresh_db_size()
{
    collection_db_size.innerText = await get_db_size();
}

//Draw the tab
export async function render_collection()
{
    await render_grid();
    await refresh_db_size();
}

//Detail card-----------------------------------------------

//Position and fill in the data of the detail card
async function render_card_data(e, kanji)
{
    //Position element and set default content while the rest loads
    kanji_card_data.style.left = `${e.clientX + 10}px`;
    kanji_card_data.style.top = `${e.clientY + 10}px`;
    kanji_card_data.style.display = "flex";
    kanji_card_data.textContent = "Loading...";  //default content

    const k = await get_kanji_data(kanji);

    //Null check kanji data response, early return if null.
    if(!k)
    {
        console.error(`Could nnot retrieve data for ${kanji}`);
        kanji_card_data.textContent = "Could not load kanji data";
        return;
    }

    //get jlpt colors
    const {fg} = kanji_color(k.jlpt);


    kanji_card_data.innerHTML = `
            <div class="kanji-card-info" style="
                display: flex; 
                gap: 12px; 
                flex-direction: column;
            ">
                <div>
                    <div class="jlpt-label" style="background: ${fg}">
                        <b>N${k.jlpt}</b>
                    </div>
                </div> 
                <div class="info">
                    <div><b>Meanings:</b> ${k.meanings.join(", ")}</div>
                    <div><b>On:</b> ${k.on_readings.join(", ") || "-"}</div>
                    <div><b>Kun:</b> ${k.kun_readings.join(", ") || "-"}</div>
                </div>
            </div>
            <div id="kanji-card-buttons" style="
                display: flex; 
                flex-direction: row;
                gap: 8px;
            ">
                <button data-char="${k.kanji}" data-action="remove" class="btn-00">Remove</button>
                <button data-action="remove" class="btn-01">Close</button>
            </div>
    `;
    
    setTimeout(() => {
        correct_position(kanji_card_data, e.clientX, e.clientY);
    }, 0);
}

function hide_card_data()
{
    kanji_card_data.style.display = "none";
}

//Search----------------------------------------------------

//Filter the grid to display only the matching kanji within the collection
async function run_search(query)
{
    hide_card_data();

    //do a healthcheck on server connection
    if(!await check_connection())
    {
        display_big_message("Connection to server lost.");
        return;
    }

    //show everything if query is empty
    if(query === "")
    {
        //'x' does not modify active sorting pattern
        await render_grid("x");
        return;
    }

    //show temp message while response loads
    display_big_message("Loading");
    const result_json = await get_kanji_from_reading(query);

    //Check for null returns (no matches or errors)
    if(result_json == null)
    {
        display_big_message("No results.");
        return;
    }

    //Process matches.
    const saved = await get_all_kanji();
    const matches = result_json.main_kanji
        .filter(kanji => kanji in saved)
        .map(kanji => saved[kanji]);

    //Check if there are no matches, and if so, display the no results message.
    if(matches.length === 0)
    {
        display_big_message("No results.");
        return;
    }

    //render grid with only matching results
    collection_container.style.display = "grid";
    collection_container.innerHTML = get_grid_HTML(matches);
}

//Init------------------------------------------------------

//Called only once, attach all even listeners
export function init_collection()
{
    collection_sort_old_btn.addEventListener("click", () => render_grid('d'));
    collection_sort_jlpt_btn.addEventListener("click", () => render_grid('l'));

    //searchbox event
    collection_searchbox.addEventListener("keydown", async (e) => {

        //early return on any key press thats not enter
        if(e.key !== "Enter") return;
        await run_search(e.target.value.trim());
    });

    //Event to call the details card is attached to the container 
    //since kanji cards are created dynamically.
    collection_container.addEventListener("click", async (e) => { 
        //get card closest to the cursor
        const card = e.target.closest(".kanji-card");

        //if no card was found, early return
        if(!card) return; 

        await render_card_data(e, card.dataset.char);
    });

    kanji_card_data.addEventListener("click", async (e) => {

        const btn = e.target.closest(`button[data-action]`);
        if(!btn) return;

        e.stopPropagation();

        //card's close button
        if(btn.dataset.action === "close")
        {
            hide_card_data();
            return;
        }

        //card's remove button, requests the removal of an entry 
        //from the database and removes the grid component as well.
        if(btn.dataset.action === "remove")
        {
            await remove_kanji(btn.dataset.char);

            //remove card from grid without a full re-render
            const grid_card = collection_container
                .querySelector(`[data-char="${btn.dataset.char}"]`);
            if(grid_card) grid_card.remove();

            //refresh counter and hide popup
            await refresh_db_size();
            hide_card_data();
        }
    })
}
