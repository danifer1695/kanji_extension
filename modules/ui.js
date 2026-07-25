//This module take care of the tab bar and the logged-in/logged-out screen rules
//
//This module imports nothing to avoid circular dependencies

//Tab bar elements------------------------------------------
const tab_bar =             document.getElementById("tab-bar");
const tab_collection_btn =  document.getElementById("btn-tab-collection");
const tab_settings_btn =    document.getElementById("btn-tab-settings");

//Tab switching---------------------------------------------

//Possible values: "collection", "account", "settings"
export function display_tab(tab)
{
    //get all tab elements, and hide them
    document.querySelectorAll(".tab-panel").forEach(p => p.style.display = "none");

    //now we show only the tab we want
    document.getElementById(`tab-${tab}`).style.display = "block";

    //deselect all buttons
    document.querySelectorAll(".btn-tab-active").forEach(b => b.className = "btn-tab");

    //select "tab"'s button 
    document.getElementById(`btn-tab-${tab}`).className = "btn-tab-active";
}

//Tab bar's click handler
export function init_tab_bar()
{
    //display the tab matching the dataset of the nearest button.
    tab_bar.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-tab");
        if(!btn) return;

        display_tab(btn.dataset.tab);
    });
}

//Logged-in/logged-out display------------------------------

//if auth token is missing, only the account tab button is visible
export function show_unauthenticated_ui()
{
    tab_collection_btn.style.display = "none";
    tab_settings_btn.style.display = "none";
    display_tab("account");
}

export function show_authenticated_ui()
{
    tab_collection_btn.style.display = "block";
    tab_settings_btn.style.display = "block";
}
