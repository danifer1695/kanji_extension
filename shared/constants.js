//Structural constants
const manifest = chrome.runtime.getManifest();
const app_version = manifest.version;

let active_palette = "default";

//COLOR constants
const PALETTES = {
    migaku: {
        gradient_top: "#ff8c2a",
        gradient_bottom: "#ff296d",
        bg_idle_00: "#202047",
        bg_idle_01: "#0a002a",
        bg_idle_02: "#2b2b60",
        bg_selected: "#36206d",
        border_idle: "#54547e",
        border_hover: "#9a96a7",

        //------------Kanji Collection------------------
        collection_button_01_bg: "#493085",
        collection_button_01_text: "#bd6eff",

        //------------JLPT Colors------------------
        N5_FG: "#00c7a4", N5_BG: "#ddfff9",
        N4_FG: "#3c91ff", N4_BG: "#dff4ff",
        N3_FG: "#702bcb", N3_BG: "#ede3ff",
        N2_FG: "#fab73d", N2_BG: "#faf0d4",
        N1_FG: "#ff296d", N1_BG: "#ffe0e7",
        NX_FG: "#9a9abd", NX_BG: "#ededf3",
    },
    default: {
        gradient_top: "#f34bb0",
        gradient_bottom: "#e80520",
        bg_idle_00: "#2e2d2d",
        bg_idle_01: "#151314",
        bg_idle_02: "#3d393c",
        bg_selected: "#585255",
        border_idle: "#484348",
        border_hover: "#b8b4b5",

        //------------Kanji Collection------------------
        collection_button_01_bg: "#8b2437",
        collection_button_01_text: "#fa6688",

        //------------JLPT Colors------------------
        N5_FG: "#00c7a4", N5_BG: "#ddfff9",
        N4_FG: "#3c91ff", N4_BG: "#dff4ff",
        N3_FG: "#702bcb", N3_BG: "#ede3ff",
        N2_FG: "#fab73d", N2_BG: "#faf0d4",
        N1_FG: "#ff296d", N1_BG: "#ffe0e7",
        NX_FG: "#9a9abd", NX_BG: "#ededf3",
    },

}; 

//This function catches any COLORS call and matches it to the currently
//active palette.
const COLORS = new Proxy({}, {
    get(_, key) {
        return PALETTES[active_palette][key];
    }
});

