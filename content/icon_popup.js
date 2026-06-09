
//Variables---------------------------------------------------------
//Structural elements
const screen_login = document.getElementById("screen-login");
const screen_main = document.getElementById("screen-main");
const auth_error = document.getElementById("login-auth-error");
const drawer = document.getElementById("settings_drawer");
let drawer_is_open = false;

//Buttons
const button_login = document.getElementById("login-btn-login");
const button_register = document.getElementById("login-btn-register");
const button_settings = document.getElementById("icon_popup_settings_btn");
const button_logout = document.getElementById("icon-popup-btn-logout");
const button_collection = document.getElementById("icon_popup_collection_btn");
const button_palette_dark = document.getElementById("palette-dark");
const button_palette_light = document.getElementById("palette-light");

//Authorization
const API_BASE = "http://localhost:3000";

//Auth helpers-------------------------------------------------------
//Fill and show error message in case of bad authorization.
function show_error(message)
{
    auth_error.textContent = message;
    auth_error.style.display = "block";
}

//Toggle set login or main screens visible
function show_screen(screen_name)
{
    screen_login.style.display = screen_name === "login" ? "block" : "none";
    screen_main.style.display = screen_name === "main" ? "block" : "none";
}

//function for api requests. Endpoint left as a variable so that the function 
//can be used both for logging in and registering
async function api_auth(endpoint, email, password)
{
    //Try reaching the server, return null if server is unreachable
    try
    {
        const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });
        return res;
    } catch(e)
    {
        return null;
    }

}

//Initialization-----------------------------------------------------
//Display current version
document.querySelectorAll(".app-version-text").forEach(p => {
    p.innerText = app_version;
});

//Check if there is an auth token and display the appropriate view
//If no token: user is not logged in, display login screen.
//If there is a token: user is logged in, display main screen.
get_token().then(token => {
    show_screen(token ? "main" : "login");
})

//Attach functions to buttons----------------------------------------
//Login screen-----------
button_login.addEventListener("click", async () => {
    //get the contents of the input boxes
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    if(!email || !password) show_error("Please fill in both fields.");

    //Request to route POST /auth/login, show error if server was unreachable
    const res = await api_auth("login", email, password);
    if(!res) return show_error("Server could not be reached.");
    
    const data = await res.json();
    //if response returns with an error, display it 
    //status codes with values within 200-299 return true. Values outside return false.
    if(!res.ok) return show_error(data.error || "Login failed.");

    //If login was successful, save auth token and display main view.
    await set_token(data.token);
    show_screen("main");
})

button_register.addEventListener("click", async () => {
    //get contents of input boxes.
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    if(!email || !password)  show_error("Please fill in both fields.");

    //Request to route POST /auth/register
    const res = await api_auth("register", email, password);
    if(!res) return show_error("Server could not be reached.");

    const data = await res.json();
    if(!res.ok) return show_error(data.error || "Registration failed.")

    await set_token(data.token);
    show_screen("main");
})

//Main screen------------
button_collection.addEventListener("click", () => {
    chrome.windows.create({
        url: chrome.runtime.getURL("content/collection_popup.html"),
        type: "popup",
        width: 700,
        height: 700,
    });
    window.close(); //close popup
});

button_settings.addEventListener("click", () => {
    drawer_is_open = !drawer_is_open;
    drawer.style.display = drawer_is_open ? "flex" : "none";
});

button_palette_dark.addEventListener("click", () => choose_palette("default"));
button_palette_light.addEventListener("click", () => choose_palette("default-light"));

button_logout.addEventListener("click", async () => {
    await clear_token();    //from constants.js
    show_screen("login");
});
