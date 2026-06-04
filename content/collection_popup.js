//Get all different structures
const main_body = document.getElementById("main_body");
const container = document.getElementById("kanji_grid");
const middle = document.getElementById("middle");

//Create floating kanji card but hide it by default (like with littlepanel)
const kanji_card_data = document.createElement("div");
kanji_card_data.className = "collection-card-data"
kanji_card_data.style.display = "none";      //hide right away
document.body.appendChild(kanji_card_data);

//Attach events to document
create_events();

async function render_collection()
{
    //Middle Section HTML----------------------------------------
    await render_grid();

    //Header inner HTML------------------------------------------
    const db_size = await get_db_size();
    document.getElementById("collection_db_size").innerText = db_size;

    //Add events to buttons--------------------------------------
    document.getElementById("sort_old").addEventListener("click",
        async () => {
            await render_grid('d');
        });

    document.getElementById("sort_jlpt").addEventListener("click",
        async () => {
            await render_grid('l');
        });

    //Event for the searchbox
    document.getElementById("collection_footer_searchbox").addEventListener("keydown",  async (e) => {
        if(e.key === "Enter")
        {
            //Hide data card and show loading screen before request
            container.style.display = "flex";
            container.innerHTML = `<p class="collection-text-warnings">Loading...</p>`;
            kanji_card_data.style.display = "none";

            //Set display mode to grid before displaying kanjis.
            container.style.display = "grid";

            const saved = await get_all_kanji(); //from db.js
            const query = e.target.value;

            //Early return if query is empty, rendering all kanji
            if(query == "")
            {
                render_grid('x');
                return;
            }

            //Now get matches with those currently included in the database
            const result_json = await get_kanji_from_reading(query);

            //Check for null returns (no matches or errors)
            if(result_json == null)
            {
                display_no_results();
                return;
            }

            //Process matches.
            const matches = result_json.main_kanji
                .filter(kanji => kanji in saved)
                .map(kanji => saved[kanji]);

            //Check if there are no matches, and if so, display the no results message.
            if(matches.length === 0)
            {
                display_no_results();
                return;
            }

            //render grid with only matching results
            container.innerHTML = get_grid_HTML(matches);
        }
    });
}

//Helpers----------------------------------------------------------------------
//This function injects a "no results" text inside the middle section.
function display_no_results()
{
    container.style.display = "flex";
    container.innerHTML = `<p id="no_results" class="collection-text-warnings">No results found</p>`;
}


//This function will render the kanji's info card on hover over a kanji
async function render_card_data(e, kanji)
{
    kanji_card_data.style.left = `${e.clientX + 10}px`;
    kanji_card_data.style.top = `${e.clientY + 10}px`;
    
    kanji_card_data.style.display = "flex";
    kanji_card_data.textContent = "Loading...";  //default content

    const k = await get_kanji_data(kanji);
    const {fg, bg} = kanji_color(k.jlpt);
    kanji_card_data.innerHTML = `
            <div class="kanji_card_label_and_info" style="
                display: flex;  pp
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
            <div id="kanji_card_buttons" style="
                display: flex; 
                flex-direction: row;
                gap: 8px;
            ">
                <button id="kanji_card_remove_btn" data-char="${k.kanji}" class="btn-00">Remove</button>
                <button id="kanji_card_close_btn" class="btn-01">Close</button>
            </div>
    `;
    
    setTimeout(() => {
        correct_position(kanji_card_data, e.clientX, e.clientY);
    }, 0);

    //Remove button logic 
    document.getElementById("kanji_card_remove_btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;

        //Remove kanji from database
        await remove_kanji(btn.dataset.char);

        //Remove card from the grid
        const card = container.querySelector(`[data-char="${btn.dataset.char}"]`);
        if(card) card.remove(); 

        //Update db size UI
        const db_size = await get_db_size();
        document.getElementById("collection_db_size").innerHTML = db_size;

        //Close card 
        kanji_card_data.style.display = "none";
    });

    //Close button
    document.getElementById("kanji_card_close_btn").addEventListener("click", (e) => {
        e.stopPropagation();
        kanji_card_data.style.display = "none";
    });
}

async function render_grid(sorting = 'd')
{
    const saved = await get_all_kanji(); //from db.js
    const entries = Object.values(saved);

    //if collection is empty, display message and return
    if (entries.length == 0) {
        container.innerHTML = `
            <p style="size: 1.5rem; font-weight: bold;">
                No kanji saved yet.
            </p>`;
        return;
    }

    switch(sorting)
    {
        //By jlpt level
        case 'l':
            entries.sort((a, b) => b.jlpt - a.jlpt);
            break;

        //By date of entry (oldest first)
        case 'd':
            entries.sort((a, b) => b.saved_at - a.saved_at);
            break;

        //No sorting
        case 'x':
        default:
            break;
    }
    //Render kanji grid
    container.innerHTML = get_grid_HTML(entries);
}

function get_grid_HTML(list)
{
    const HTML = list.map(k => {
        const {fg, bg} = kanji_color(k.jlpt);
        return `
        <div  
            class="kanji-card" 
            data-char="${k.kanji}" 
            style="${STYLES.kanji_idle(fg, bg)}
        ">
            ${k.kanji}
        </div>
        `;
    }).join("");

    return HTML;
}

function create_events()
{ 
    container.addEventListener("mouseover", async (e) => { 
        //get card closest to the cursor
        const card = e.target.closest(".kanji-card");

        //if no card was found, early return
        if(!card) return; 

        await render_card_data(e, card.dataset.char);
    });

}

render_collection();
