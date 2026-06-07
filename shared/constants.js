//Structural constants
const manifest = chrome.runtime.getManifest();
const app_version = manifest.version;

const PALETTE_KEY = "palette";
const DEFAULT_PALETTE = "default";

async function load_palette()
{
    const result = await chrome.storage.local.get(PALETTE_KEY);
    setPalette(result[PALETTE_KEY] || DEFAULT_PALETTE);
}

function setPalette(name)
{
    document.body.className = `theme-${name}`;
}

async function choose_palette(name)
{
    setPalette(name);
    await chrome.storage.local.set({[PALETTE_KEY]: name});
}

load_palette();
