//Structural constants
const manifest = chrome.runtime.getManifest();
export const app_version = manifest.version;
export const API_BASE = "https://kanjiextensionbackend-production.up.railway.app";

export async function set_email(email)
{
    await chrome.storage.local.set({['user_email']: email});
}

export async function get_email()
{
    const result = await chrome.storage.local.get('user_email')
    return result
}
