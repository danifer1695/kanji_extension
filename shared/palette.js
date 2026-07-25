const PALETTE_KEY = "palette";
const DEFAULT_PALETTE = "default";

export async function load_palette()
{
    const result = await chrome.storage.local.get(PALETTE_KEY);
    return result[PALETTE_KEY] || DEFAULT_PALETTE;
}

export async function choose_palette(name)
{
    await chrome.storage.local.set({[PALETTE_KEY]: name});
}

//load_palette();
