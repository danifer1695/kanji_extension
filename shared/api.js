//This script takes contains functions that will take care of communicating with Kanjiapi's API

async function lookup_word(kanji_chars)
{
    let HTML = "";

    //We concatenate information on each of the kanji within the selection, one after another
    for (const kanji of kanji_chars)
    {
        //Integrate error handling in case api is down
        try {
            const kanji_response = await fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`);
            if (!kanji_response.ok) throw new Error(`API error: ${kanji_response.status}`);
            const kanji_data = await kanji_response.json();
            HTML += await render_entries(kanji_data);
        }
        catch (e) {
            console.error(`Failed to fetch kanji: ${kanji}`, e);
            HTML += `<div>Could not load data for ${kanji}</div>`;
        }
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
