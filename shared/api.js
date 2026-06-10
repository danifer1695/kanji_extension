
//Connection health---------------------------------------------------------------------------
//Return true or false depending on the state of the connection with the server
async function check_connection()
{
    try {
        const res = await fetch(`${API_BASE}/health`);
        return res.ok;
    } catch(e) {
        return false;
    }
}

//External APIs-------------------------------------------------------------------------------
//This script takes contains functions that will take care of communicating with Kanjiapi's API

async function lookup_word(kanji_chars)
{
    let HTML = "";

    //We concatenate information on each of the kanji within the selection, one after another
    for (const kanji of kanji_chars)
    {
        //Integrate error handling in case api is down
        try {
            //Send request to kanjiapi.dev's API
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
    //First check if reading is in romanji, and turn it into katakana if that's the case.
    let reading_kata = "";
    let reading_hira = "";

    //Cover cases for hiragana, katakana and romanji input.
    if(wanakana.isRomaji(reading)) 
    {
        reading_kata = wanakana.toKatakana(reading);
        reading_hira = wanakana.toHiragana(reading);
    }
    else if(wanakana.isHiragana(reading)) 
    {
        reading_hira = reading;
        reading_kata = wanakana.toKatakana(reading); // convert to kata too
    }
    else if(wanakana.isKatakana(reading)) 
    {
        reading_kata = reading;
        reading_hira = wanakana.toHiragana(reading); // convert to hira too
    }

    //returns a list of kanji
    try
    {
        //Get results for both hiragana and katakana readings.
        const response_kata = await fetch(`http://kanjiapi.dev/v1/reading/${reading_kata}`);
        const response_hira = await fetch(`http://kanjiapi.dev/v1/reading/${reading_hira}`);

        if(!response_kata.ok && !response_hira.ok) throw new Error(`API error: \n ${response_kata.status} \n ${response_hira.status}`);

        const response_kata_json = await response_kata.json();
        const response_hira_json = await response_hira.json();
        
        //Build merged result.
        const kanji_kata = (!response_kata_json.error && 
            response_kata_json.main_kanji) ? response_kata_json.main_kanji : [];
        const kanji_hira = (!response_hira_json.error && 
            response_hira_json.main_kanji) ? response_hira_json.main_kanji : [];

        //console.warn(`Kata results: ${kanji_kata.length}\nHira results: ${kanji_hira.length}`);
        //if nothing was found.
        if(kanji_kata.length === 0 && kanji_hira.length === 0)
        {
            console.log(`No results for ${reading}`);
            return null;
        }

        //Merge both results, and remove duplicates using Set()
        const merged_kanji = [...new Set([...kanji_kata, ...kanji_hira])];

        return {main_kanji: merged_kanji};
    }
    catch(e)
    {
        console.warn(`Failed to fetch reading: ${reading}`, e);
        return null;
    }
}


