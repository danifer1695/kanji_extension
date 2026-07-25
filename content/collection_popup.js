//Entry point for the extension popup window
//This file wires all modules together and runs the launch sequence.
//No rendering logic, no event handlers - that goes in the collection_tab module.

import { init_tab_bar, display_tab } from "../modules/ui.js";
import { init_account, render_account } from "../modules/tab_account.js";
import { init_collection, render_collection } from "../modules/tab_collection.js";
import { init_settings } from "../modules/tab_settings.js";
import { load_palette } from "../shared/palette.js"
import { get_token } from "../shared/auth.js";
import { check_connection } from "../shared/api.js";

//Init----------------------------------------------------------------------------

//Attach every listener from every module exactly once.
init_tab_bar();
init_account();
init_collection();
init_settings();

//Remove the window ID marker so that when the popup reopens it calls a fresh window
window.addEventListener("unload", () => {
    chrome.storage.local.remove("collectionWindowId");
});

//Launch--------------------------------------------------------------------------
async function launch()
{
    //apply current color palette first so that window does not launch
    //with the wrong color scheme
    const palette = await load_palette();
    document.body.className = `theme-${palette}`;

    //the account tab needs to decide whether to show authenticated or 
    //unathenticated UI so we allow it to settle first
    await render_account();

    //tabs can be opened directly throough the URL params.
    const params = new URLSearchParams(window.location.search);
    const initial_tab = params.get("tab");

    //Check for token and connection health
    const token_present = await get_token() != null;
    const connection_ok = await check_connection();
    console.log(`Token present on launch: ${token_present}`);

    //Show initial tab if connection & token checks pass
    if(initial_tab && token_present && connection_ok) 
    {
        display_tab(initial_tab);
        render_collection();
    }

    //else go to straight to account tab
    else
    {
        display_tab("account");
    }
}

launch();
