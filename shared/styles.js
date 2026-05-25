const STYLES = {
    title_text_gradient: `
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to bottom, ${COLORS.gradient_top}, ${COLORS.gradient_bottom});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 3rem;
        font-weight: 900;
        line-height: 1;
    `,
    box_style_00: `
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: ${COLORS.bg_idle_01};
        border-radius: 16px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `,
    box_style_01: `
        border-radius: 12px;
        border: 2px solid rgba(255 255 255 / 19%);
        background-color: ${COLORS.bg_idle_02};
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 10px 12px;
    `,
    box_search_01: `
        border-radius: 20px;
        border: 2px solid rgba(255 255 255 / 19%);
        color: white;
        background-color: ${COLORS.bg_idle_02};
        padding: 8px 16px;
    `,
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
    kanji_container: `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
    `,
    kanji_info: `
        font-size: 12px; 
        line-height: 1.6;
        width: 200px;
        word-wrap: break-word;
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
    //===========================================================
    //RESULT PANEL
    //===========================================================
    result_panel: (in_colorBG) => `
        padding: 10px; 
        display: flex; 
        flex-direction: row; 
        gap: 15px; 
        align-items: center; 
        justify-content: center;
        border-radius: 13px;
        width: 100%;
        background: ${in_colorBG};
    `,
    result_outline: (in_colorBG) => `
        border-radius: 15px;
        box-sizing: border-box;
        padding: 2px;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
        display: flex;
        background: ${in_colorBG};
    `,
    //===========================================================
    //KANJI ADD BUTTON
    //===========================================================
    add_button_idle: (in_colorBG, in_colorBorder) => `
        background: ${in_colorBG};
        box-shadow: inset 0 0 0 2px ${in_colorBorder};
        color: ${in_colorBorder};
        font-weight: bold;
        font-size: 20px;
        width: 32px; 
        height: 32px; 
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        float: right;
        padding: 2px;
        cursor: pointer;
    `,
    add_button_hovered: (in_gradientTop, in_gradientBottom) => `
        background: linear-gradient(to bottom, ${in_gradientTop}, ${in_gradientBottom});
        box-shadow: inset 0 0 0 0px;
        color: white;
        font-weight: bold;
        font-size: 20px;
        width: 32px; 
        height: 32px; 
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        float: right;
        padding: 2px;
        cursor: pointer;
    `,
    //===========================================================
    //PANEL
    //===========================================================
    panel_idle: (in_colorBG) => `
        position: fixed;
        background: ${in_colorBG};
        border-radius: 15px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 99999;     
        min-width: 150px;
        font-family: InterVariable, sans-serif;
        max-height: 400px;
        overflow-y: auto;
        scrollbar-width: none;
        font-size: 14px;
        color: white;
    `,
    //===========================================================
    //COLLECTION ELEMENTS
    //===========================================================
    collection_card_data: (in_colorBG) => `
        background: ${in_colorBG};
        position: fixed;
        flex-direction: column;
        z-index: 9999;
        border-radius: 15px;
        padding: 16px;
        gap: 16px;
        margin-bottom: 8px;
        max-width:200px;
        min-width: 150px;
        font-family: InterVariable, sans-serif;
        font-size: 14px;
        color: white;
    `,
    collection_main_body: (in_colorBG) => `
        background: ${in_colorBG};
        color: white;
        margin: 0;
        box-sizing: border-box;
        overflow-x: hidden;
        align-items:center;
        justify-content: center;
    `,
    collection_kanji_grid: `
        display: grid;
        grid-template-columns: repeat(6, 84px);
        scrollbar-width: none;
        overflow-y: auto;
        flex-wrap: wrap;
        gap: 16px;
        padding: 16px;
        height: 400px;
        align-content: start;
        justify-self: center;
    `,
    collection_footer: `
        display: flex;
        padding: 16px;
        gap:8px;
        align-items: center;
        bottom: 0;
        left:0;
        border-bottom: 1px solid rgba(255 255 255 / 22%);
    `,
    collection_button_01: `
        cursor: pointer;
        appearance:none;
        border:none;
        background:none;
        font-size: 1rem;
        font-weight: 900;
        line-height: 1.25rem;
        background-color: ${COLORS.collection_button_01_bg};
        color: ${COLORS.collection_button_01_text};
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        gap:4px;
        border-radius: 20px;
        position: relative;
        display:inline-flex;
        flex-direction: row;
        text-decoration: none;
    `,
    collection_button_00: `
        cursor: pointer;
        display:inline-flex;
        width: fit-content;
        appearance:none;
        border:none;
        background:linear-gradient(to bottom, ${COLORS.gradient_top}, ${COLORS.gradient_bottom});
        font-size: 1rem;
        font-weight: 900;
        color: white;
        line-height: 1.25rem;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        border-radius: 20px;
        position: relative;
        flex-direction: row;
        text-decoration: none;
    `,
}
