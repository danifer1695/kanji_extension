//Global elements-------------------------------------------
const main_body =   document.getElementById("main-body");
const tab_bar =     document.getElementById("tab-bar");

//Collection tab elements-----------------------------------
const collection_container =   document.getElementById("kanji-grid");

//Account tab elements--------------------------------------
const account_login =           document.getElementById("account-screen-login");
const account_main =            document.getElementById("account-screen-main");
const account_error =           document.getElementById("login-auth-error");
const account_login_btn =       document.getElementById("login-btn-login");
const account_register_btn =    document.getElementById("login-btn-register");
const account_email_field =     document.getElementById("login-email");
const account_pass_field =      document.getElementById("login-password");
const account_logout_btn =      document.getElementById("account-btn-logout");
const account_delete_btn =      document.getElementById("account-btn-delete");
const account_change_pass_btn = document.getElementById("account-btn-change-pass");

//Settings tab elements-------------------------------------
const settings_palette_dark =   document.getElementById("palette-dark");
const settings_palette_light =   document.getElementById("palette-light");

//Create floating kanji card but hide it by default (like with littlepanel)
const kanji_card_data = document.createElement("div");
kanji_card_data.className = "collection-card-data"
kanji_card_data.style.display = "none";      //hide right away
document.body.appendChild(kanji_card_data);

//Attach events to document
create_events();


// Collection Tab------------------------------------------------------------------------------------
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
            collection_container.style.display = "flex";
            collection_container.innerHTML = `<p class="collection-text-warnings">Loading...</p>`;
            kanji_card_data.style.display = "none";

            //Set display mode to grid before displaying kanjis.
            collection_container.style.display = "grid";

            //Early return if there is no connection with server. check_connection() in api.js
            if(!check_connection())
            {
                display_big_message("Connection to server lost.");
                return;
            }

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
                display_big_message("No results.");
                return;
            }

            //Process matches.
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
            collection_container.innerHTML = get_grid_HTML(matches);
        }
    });
}

//This function injects a text inside the middle section.
function display_big_message(message)
{
    collection_container.style.display = "flex";
    collection_container.innerHTML = `<p id="no_results" class="collection-text-warnings">${message}</p>`;
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
        const card = collection_container.querySelector(`[data-char="${btn.dataset.char}"]`);
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
        collection_container.innerHTML = `
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
    collection_container.innerHTML = get_grid_HTML(entries);
}

function get_grid_HTML(list)
{
    const HTML = list.map(k => {
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

    return HTML;
}

// Account Tab --------------------------------------------------------------------------------------

function account_show_screen(screen)
{
    account_login.style.display = 
        screen === "login" ? "flex" : "none";
    
    account_main.style.display = 
        screen === "main" ? "flex" : "none";
}

function account_show_error(message)
{
    account_error.textContent = message;
    account_error.style.display = "block";
}

async function api_auth(endpoint, email, password)
{
    //Send a request to the API to get an auth token.
    try
    {
        const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });
        return res;
    }
    catch(e)
    {
        return null;
    }
}

async function initialize_account_tab()
{
    //Attempt to get auth token.
    const token = await get_token();

    //If no token is found, show login screen.
    if(!token)
    {
        account_show_screen("login");
        return;
    }

    //Check connection before showing main account screen.
    //If connection with server is not possible, show login screen.
    const connection_ok = check_connection();   //in shared/api.js
    if(connection_ok)
    {
        account_show_screen("main");
    }
    else
    {
        account_show_screen("login");
        account_show_error("Could not reach server.");
    }
}

account_login_btn.addEventListener("click", async() => {
    const email = account_email_field.value.trim();
    const password = account_pass_field.value;
    //null check on both fields is done on the back end.

    const res = await api_auth("login", email, password);
    if(!res) return account_show_error("Could not reach server.");

    const data = await res.json();
    //If response status code is outside the 200-299 range, something went wrong.
    //In that case, api attaches an "error" field to the response's json. Display it.
    if (!res.ok) return account_show_error(data.error || "Login failed.");

    //If successful, get token from respoonse.
    //Then display main 
    await set_token(data.token);
    account_show_screen("main");
    display_tab("collection");
});

account_register_btn.addEventListener("click", async() => {
    const email = account_email_field.value.trim();
    const password = account_pass_field.value;

    const res = await api_auth("register", email, password);
    if(!res) return account_show_error("Could not reach server.");

    const data = await res.json();
    if(!res.ok) return account_show_error(data.error || "Registration failed.");

    await set_token(data.token);
    display_tab("collection");
});


account_logout_btn.addEventListener("click", async() => {

    //clear auth token and show login screen.
    await clear_token();
    account_show_screen("login");
});


// Settings Tab -------------------------------------------------------------------------------------

settings_palette_dark.addEventListener("click", () => {
    choose_palette("default");
});

settings_palette_light.addEventListener("click", () => {
    choose_palette("default-light");
})

// Global Methods------------------------------------------------------------------------------------
//Acceptable values: "account", "settings", "collection"
function display_tab(tab)
{
    document.querySelectorAll(".tab-panel").forEach(p => p.style.display = "none");
    document.getElementById(`tab-${tab}`).style.display = "block";

    //deselect all buttons
    document.querySelectorAll(".btn-tab-active").forEach(b => b.className = "btn-tab");

    //select "tab"'s button 
    document.getElementById(`btn-tab-${tab}`).className = "btn-tab-active";
}

function create_events()
{ 
    collection_container.addEventListener("click", async (e) => { 
        //get card closest to the cursor
        const card = e.target.closest(".kanji-card");

        //if no card was found, early return
        if(!card) return; 

        await render_card_data(e, card.dataset.char);
    });

    //Attach an unload event listener to remove the collectionWindowId variable when closed.
    window.addEventListener("unload", () => {
        chrome.storage.local.remove("collectionWindowId");
    });

    //Tab switching
    tab_bar.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-tab");
        if(!btn) return;

        //set all tab buttons to "not-active"
        document.querySelectorAll(".btn-tab-active").forEach(b => b.className = "btn-tab");
        //set current button to "active"
        btn.className = "btn-tab-active";

        //hide all tabs then display only the one selected.
        document.querySelectorAll(".tab-panel").forEach(p => p.style.display = "none");
        document.getElementById(`tab-${btn.dataset.tab}`).style.display = "block";
    });
}


render_collection();
initialize_account_tab();
