//Structural constants
const app_version = "v.0.1.0";

let active_palette = "migaku";

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
        gradient_top: "#7d86ff",
        gradient_bottom: "#ea00ff",
        bg_idle_00: "#263338",
        bg_idle_01: "#101919",
        bg_idle_02: "#2a4148",
        bg_selected: "#1e525a",
        border_idle: "#11738a",
        border_hover: "#65a4ba",

        //------------Kanji Collection------------------
        collection_button_01_bg: "#38516e",
        collection_button_01_text: "#4ec3e7",

        //------------JLPT Colors------------------
        N5_FG: "#17d847", N5_BG: "#ddfff9",
        N4_FG: "#07b3df", N4_BG: "#dff4ff",
        N3_FG: "#4100ba", N3_BG: "#ede3ff",
        N2_FG: "#e7ff0b", N2_BG: "#faf0d4",
        N1_FG: "#bf0a74", N1_BG: "#ffe0e7",
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

