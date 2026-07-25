import { get_token } from "./auth.js";
import { API_BASE } from "./constants.js";

//Request---------------------------------------------------------------------------------
//api_request sends any kind of requests to the server.
//returns null if an error occurs.
export async function api_request(method, path, body = null)
{
    const token = await get_token();    //From constants.js
    //if(!token) throw new Error("Authentification failed");
    if(!token) return null;

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
export async function save_kanji(kanji_data) 
{
    const res = await api_request("POST", "/kanji", {
        ...kanji_data,
        saved_at: Date.now(),
    });
    if(!res) console.warn(`db.js::save_kanji:: Failed for: ${kanji_data.kanji}`);
}

//send request to remove a kanji from the db
export async function remove_kanji(kanji_char)
{
    const res = await api_request("DELETE", `/kanji/${encodeURIComponent(kanji_char)}`);
    if(!res) console.warn(`db.js::remove_kanji:: Failed for: ${kanji_char}`);
}

//Send request to retrieve all kanji saved in the db
export async function get_all_kanji()
{
    const res = await api_request("GET", "/kanji");
    if(!res) return {};

    const rows = await res.json();

    //Convert to dictionary format that the front end uses to display the kanji
    return Object.fromEntries(rows.map(k => [k.kanji, k]));
}

//find if a given kanji is in dictionary returned by get_all_kanji()
export async function db_contains_kanji(kanji)
{
    const res = await api_request("GET", `/kanji/contains?kanji=${kanji}`);
    if(!res) return false;

    //Response should contain a single true / false value
    return await res.json();
}

//Send a request to GET /kanji/size
export async function get_db_size()
{
    const res = await api_request("GET", "/kanji/size");
    //if response is null, return 999999 so we know something is awry
    if(!res) return 999999;
    
    return await res.json();
}
