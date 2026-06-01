//Structural constants
const manifest = chrome.runtime.getManifest();
const app_version = manifest.version;

let active_palette = "default";

function setPalette(name)
{
    document.body.className = `theme-${name}`;
}

setPalette("default");
