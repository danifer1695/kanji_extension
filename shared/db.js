//database data will be stored using chrome.storage.local
//max size: 5mb
//persists across sessions - survives browser restarts
//
//GOAL is to eventually move this to the cloud

const DB_KEY = "saved_kanji";

//This function will be called upon pressing the "+" button
async function save_kanji(kanji_data) 
{
    //First we get the dictionary-formatted database from chrome's storage
    const result = await chrome.storage.local.get(DB_KEY);
    const saved = result[DB_KEY] || {};

    //then we add a new entry (kanji is the key)
    saved[kanji_data.kanji] = {
        kanji:          kanji_data.kanji,
        on_readings:    kanji_data.on_readings,
        kun_readings:   kanji_data.kun_readings,
        meanings:       kanji_data.meanings,
        jlpt:           kanji_data.jlpt,
        saved_at:       Date.now(),
    }

    await chrome.storage.local.set({[DB_KEY]: saved});
}

//Function to remove a kanji from the database
async function remove_kanji(kanji_char)
{
    const result = await chrome.storage.local.get(DB_KEY);
    const saved = result[DB_KEY] || {};
    delete saved[kanji_char];

    await chrome.storage.local.set({[DB_KEY]: saved});
}
//This function checks whether a kanji already exists in the database or not
async function db_contains_kanji(kanji)
{
    const result = await chrome.storage.local.get(DB_KEY);
    const saved = result[DB_KEY] || {};

    //Returns true or false depending on whether 'kanji' is in db
    return kanji in saved;
}

//Function to get all saved kanji
//Returns json formatted list
async function get_all_kanji()
{
    const result = await chrome.storage.local.get(DB_KEY);
    return result[DB_KEY] || {};
}

//Function to get information on one specific kanji
async function get_kanji_data(kanji)
{
    const result = await chrome.storage.local.get(DB_KEY);
    const saved = result[DB_KEY] || {};

    return saved[kanji] || {};
}

//Get size of the database
async function get_db_size()
{
    const result = await chrome.storage.local.get(DB_KEY);
    const saved = result[DB_KEY] || {};
    return Object.keys(saved).length;
}
