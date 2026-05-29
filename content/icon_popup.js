document.body.innerHTML = `
    <div class="icon_popup_header", style="
        ${STYLES.title_text_gradient} 
        border-bottom: 1px solid rgba(255 255 255 / 22%);
        padding: 16px;">
        漢字
    </div>
    <div style="${STYLES.box_style_00}">
        <button id="icon_popup_collection_btn" style="${STYLES.collection_button_00} width: 100%">
            Open Kanji Collection
        </button>
        <button id="icon_popup_settings_btn" style="${STYLES.collection_button_01} width: 100%">
            Settings
        </button>
        <button id="icon_popup_exit_btn" style="${STYLES.collection_button_01}">
            Exit
        </button>
    </div> 
    <div class="icon_popup_footer" style="
        border-top: 1px solid rgba(255 255 255 / 22%);
        color: rgba(255 255 255 / 35%);
        padding: 8px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    ">
        <b>${app_version}</b>
    </div>
`;
document.body.style.backgroundColor = COLORS.bg_idle_01;

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
