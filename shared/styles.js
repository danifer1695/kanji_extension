export const STYLES = {
    //===========================================================
    //KANJI BOX
    //===========================================================
    kanji_idle: (in_colorFG, in_colorBG) => `
        background: ${in_colorBG}; 
        border: 2px solid ${in_colorFG}; 
        border-radius: 15px; 
        font-size: 48px; 
        color: ${in_colorFG}; 
        font-weight: bold; 
        flex-shrink: 0; 
        height: 80px; 
        width: 80px; 
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    kanji_jlpt_label: (in_colorBG) => `
        display: inline-flex;
        color: white;
        font-weight: bold;
        font-size: 1rem;
        background-color: ${in_colorBG};
        border-radius: 16px;
        min-width: 30px;
        padding: 8px;
        justify-content: center;
        align-items: center;
    `,
}

//This function sets the colors of the kanji boxes depending on their jlpt level
export function kanji_color(kanji_jlpt)
{
    switch(kanji_jlpt) {
        case 5: return {fg: "var(--N5-fg)",bg: "var(--N5-bg)"};
        case 4: return {fg: "var(--N4-fg)",bg: "var(--N4-bg)"};
        case 3: return {fg: "var(--N3-fg)",bg: "var(--N3-bg)"};
        case 2: return {fg: "var(--N2-fg)",bg: "var(--N2-bg)"};
        case 1: return {fg: "var(--N1-fg)",bg: "var(--N1-bg)"};
        default: return {fg: "var(--NX-fg)",bg: "var(--NX-bg)"};
    }
}



