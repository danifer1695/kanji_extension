
//Get all the elements----------------------------------------------
const version_text = document.getElementById("app_version_text");

const button_settings = document.getElementById("icon_popup_settings_btn");
const button_palette_dark = document.getElementById("palette-dark");
const button_palette_light = document.getElementById("palette-light");

const drawer = document.getElementById("settings_drawer");
let drawer_is_open = false;

//Set inner variables------------------------------------------------
version_text.innerText = app_version;

//Attach functions to buttons----------------------------------------
document.getElementById("icon_popup_collection_btn").addEventListener("click", () => {
    chrome.windows.create({
        url: chrome.runtime.getURL("content/collection_popup.html"),
        type: "popup",
        width: 700,
        height: 700,
    });
    window.close(); //close popup
});

button_settings.addEventListener("click", () => {
    drawer_is_open = !drawer_is_open;
    drawer.style.display = drawer_is_open ? "flex" : "none";
});

button_palette_dark.addEventListener("click", () => choose_palette("default"));
button_palette_light.addEventListener("click", () => choose_palette("default-light"));

document.getElementById("icon_popup_exit_btn").addEventListener("click", () => {
    //Just close the window.
    window.close();
});
