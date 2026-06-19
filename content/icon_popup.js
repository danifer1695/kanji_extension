const btn_open =    document.getElementById("icon-popup-btn-open");
const btn_close =   document.getElementById("icon-popup-btn-close");
const version_text = document.getElementById("version-text");

async function initialize()
{
    //Display version text.
    version_text.innerText = app_version; //defined in shared/constants.js

    //Set open button label based on auth state (token or no token)
    const token = await get_token();
    btn_open.textContent = token ? "Open Shirabeyou" : "Login";
}

btn_open.addEventListener("click", async () => {

    await open_collection_popup("collection");  //defined in shared/window_manager.js
    window.close();
});

btn_close.addEventListener("click", () => {

    //Just close the window.
    window.close();
})

initialize();
