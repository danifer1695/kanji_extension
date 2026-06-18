
//Request---------------------------------------------------------------------------------
//api_request sends any kind of requests to the server.
//returns null if an error occurs.
async function api_request(method, path, body = null)
{
    const token = await get_token();    //From constants.js
    if(!token) throw new Error("Authentification failed");

    const options = 
        {
            method,
            headers: {
                //content-type tells app.use(express.json()) that the data is coming in in json format 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };
    if(body) options.body = JSON.stringify(body);

    //send request, check for errors
    let res;
    try{
        //Put endpoint route together and send request 
        res = await fetch(`${API_BASE}${path}`, options);
    }
    catch(e)
    {
        console.error(`db.js:: Network error on ${method} ${path}: `, e.message);
        return null;
    }

    //check for bad responses
    if(!res.ok) 
    {
        //Get status text from response.
        const error = await res.json().catch(() => ({error: res.statusText}));
        console.error(`db.js:: ${method} ${path} failed (${res.status}): `, error.error);
        return null;
    }

    return res;
}

//send request to save a kanji in the db
async function save_kanji(kanji_data) 
{
    const res = await api_request("POST", "/kanji", {
        ...kanji_data,
        saved_at: Date.now(),
    });
    if(!res) console.warn(`db.js::save_kanji:: Failed for: ${kanji_data.kanji}`);
}

//send request to remove a kanji from the db
async function remove_kanji(kanji_char)
{
    const res = await api_request("DELETE", `/kanji/${encodeURIComponent(kanji_char)}`);
    if(!res) console.warn(`db.js::remove_kanji:: Failed for: ${kanji_char}`);
}

//Send request to retrieve all kanji saved in the db
async function get_all_kanji()
{
    const res = await api_request("GET", "/kanji");
    if(!res) return {};

    const rows = await res.json();

    //Convert to dictionary format that the front end uses to display the kanji
    return Object.fromEntries(rows.map(k => [k.kanji, k]));
}

//find if a given kanji is dictionary returned by get_all_kanji()
async function db_contains_kanji(kanji)
{
    const saved = await get_all_kanji();
    return kanji in saved;
}

//Retrieve all saved kanji in dictionary form and look for a matching entry
async function get_kanji_data(kanji)
{
    const saved = await get_all_kanji();
    return saved[kanji] || {};
}

//Get size of the database by retrieing its contents in dictionary form and returning its length.
async function get_db_size()
{
    const saved = await get_all_kanji();
    return Object.keys(saved).length;
}
