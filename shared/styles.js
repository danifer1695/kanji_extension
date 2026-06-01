const STYLES = {
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
