
//Set inner variables------------------------------------------------
document.getElementById("app_version_text").innerText = app_version;

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

document.getElementById("icon_popup_settings_btn").addEventListener("click", () => {
    //WIP
    window.close();
});

document.getElementById("icon_popup_exit_btn").addEventListener("click", () => {
    //Just close the window.
    window.close();
});
