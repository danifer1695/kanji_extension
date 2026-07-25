import { choose_palette } from "../shared/palette.js";


//Elements--------------------------------------------------

const settings_palette_dark =       document.getElementById("palette-dark");
const settings_palette_light =      document.getElementById("palette-light");

//Palette---------------------------------------------------

//Map (dictionary) of button elements to theme name
const PALETTES = [
    [settings_palette_dark, "default"],
    [settings_palette_light, "default-light"]
];

function apply_palette(name)
{
    document.body.className = `theme-${name}`;
    choose_palette(name);
}

//Init------------------------------------------------------

//Called once from the entry file (collection_popup.js)
export function init_settings()
{
    for( const [btn, name] of PALETTES)
    {
        btn.addEventListener("click", () => apply_palette(name));
    }
}
