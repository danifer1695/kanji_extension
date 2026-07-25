//Structural constants
const manifest = chrome.runtime.getManifest();
export const app_version = manifest.version;
export const API_BASE = "https://kanjiextensionbackend-production.up.railway.app";

//Authentification----------------------------------------------------------------------------
//auth token is saved in chrome.storage.local

//export const AUTH_KEY = "auth_token";

//async function get_token()
//{
//    const result = await chrome.storage.local.get(AUTH_KEY);
//    return result[AUTH_KEY] || null;
//}
//
//async function set_token(token)
//{
//    await chrome.storage.local.set({[AUTH_KEY]: token});
//}

//async function clear_token()
//{
//    await chrome.storage.local.remove(AUTH_KEY);
//}


//Color palette-------------------------------------------------------------------------------

//const PALETTE_KEY = "palette";
//const DEFAULT_PALETTE = "default";

//async function load_palette()
//{
//    const result = await chrome.storage.local.get(PALETTE_KEY);
//    return result[PALETTE_KEY] || DEFAULT_PALETTE;
//}

//async function choose_palette(name)
//{
//    await chrome.storage.local.set({[PALETTE_KEY]: name});
//}

//load_palette();
