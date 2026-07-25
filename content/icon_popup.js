import { app_version } from "../shared/constants.js";
import { get_token } from "../shared/auth.js";
import { load_palette } from "../shared/palette.js";
import { open_collection_popup } from "../shared/window_manager.js";

//Elements-------------------------------------------------------------------

const btn_open =    document.getElementById("icon-popup-btn-open");
const btn_close =   document.getElementById("icon-popup-btn-close");
const version_text = document.getElementById("version-text");

//Init: attach listeners once------------------------------------------------

btn_open.addEventListener("click", async () => {

    await open_collection_popup("collection");  //defined in shared/window_manager.js
    window.close();
});

btn_close.addEventListener("click", () => {

    //Just close the window.
    window.close();
})

//Launch---------------------------------------------------------------------

async function launch()
{
    //set color palette
    const palette = await load_palette();
    document.body.className = `theme-${palette}`;

    //Display version text.
    version_text.innerText = app_version; //defined in shared/constants.js

    //Set open button label based on auth state (token or no token)
    const token = await get_token();
    btn_open.textContent = token ? "Open Shirabeyou" : "Login";
}


launch();
