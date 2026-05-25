//This script takes contains functions that will take care of communicating with Kanjiapi's API

//=============================================================
//Kanji lookup
//=============================================================
async function lookup_word(kanji_chars)
{
    let HTML = "";

    //We concatenate information on each of the kanji within the selection, one after another
    for (const kanji of kanji_chars)
    {
        const kanji_response = await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`);
        const kanji_data = await kanji_response.json();
        HTML += await render_entries(kanji_data);
    }        

    return HTML;
}

async function get_kanji_from_reading(reading)
{
    //returns a list of kanji
    const response = await fetch(`http://kanjiapi.dev/v1/reading/${reading}`);
    const response_json = await response.json();

    //return json formatted results
    return response_json;
}
