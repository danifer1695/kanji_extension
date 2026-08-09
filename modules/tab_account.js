//This module owns: login, register, change pass, delete account
//plus all four subscreens it switches back and forth from

import { check_connection } from "../shared/api.js"
import { API_BASE } from "../shared/constants.js"
import { get_token, set_token, clear_token } from "../shared/auth.js"
import { 
    display_tab,
    show_authenticated_ui,
    show_unauthenticated_ui
} from "./ui.js"
import { render_collection } from "./tab_collection.js"

//HTML Elements-------------------------------------------------------------------
const account_screen_login =        document.getElementById("account-screen-login");
const account_screen_main =         document.getElementById("account-screen-main");
const account_screen_change_pass =  document.getElementById("account-screen-change-pass")
const account_screen_delete =       document.getElementById("account-screen-delete");
const account_screen_register =       document.getElementById("account-screen-create-account")
const account_error =               document.getElementById("login-auth-error");
const account_screen_login_btn =    document.getElementById("login-btn-login");
const account_register_btn =        document.getElementById("login-btn-register");
const account_username_field =      document.getElementById("login-username");
const account_pass_field =          document.getElementById("login-password");
const account_logout_btn =          document.getElementById("account-btn-logout");
const account_delete_btn =          document.getElementById("account-btn-delete");
const account_change_pass_btn =     document.getElementById("account-btn-change-pass");

const register_username =       document.getElementById("register-username")
const register_pass =           document.getElementById("register-password")
const register_pass_repeat =    document.getElementById("register-password-repeat")
const register_error =          document.getElementById("register-error")
const register_btn =            document.getElementById("register-btn-register")
const register_back_btn =       document.getElementById("register-btn-back")

const change_pass_current =     document.getElementById("change-pass-current");
const change_pass_new =         document.getElementById("change-pass-new");
const change_pass_confirm =     document.getElementById("change-pass-confirm");
const change_pass_error =       document.getElementById("change-pass-error");
const change_pass_submit_btn =  document.getElementById("change-pass-submit-btn");
const change_pass_back_btn =    document.getElementById("change-pass-back-btn");

const delete_error =        document.getElementById("delete-error");
const delete_confirm_btn =  document.getElementById("delete-confirm-btn");
const delete_back_btn =     document.getElementById("delete-back-btn");


//Switching subscreens---------------------------------------------------------------

//To switch between the different Account subscreens
//acceptable values: login, main, change-pass, delete
function account_show_screen(screen)
{
    //DEBUGGING-------
    //console.log(`Switching account screens to: ${screen}`);
    //----------------

    account_screen_login.style.display = 
        screen === "login" ? "flex" : "none";
    
    account_screen_main.style.display = 
        screen === "main" ? "flex" : "none";

    account_screen_change_pass.style.display = 
        screen === "change-pass" ? "flex" : "none";
 
    account_screen_delete.style.display = 
        screen == "delete" ? "flex" : "none";

    account_screen_register.style.display = 
        screen == "register" ? "flex" : "none";
}

function account_show_error(message)
{
    account_error.textContent = message;
    account_error.style.display = "block";
}

function register_show_error(message)
{
    register_error.textContent = message;
    register_error.style.display = "block"
}

//Helper - clear every field in the change-pass subscreen
function reset_change_pass_screen()
{
    //Clear input fields before going back.
    change_pass_current.value = "";
    change_pass_new.value = "";
    change_pass_confirm.value = "";
    change_pass_error.textContent = "";
    change_pass_error.style.display = "none";
}

function reset_register_screen()
{
    //Clear all fields.
    register_username.value = ""
    register_pass.value = ""
    register_pass_repeat.value = ""
    register_error.textContent = ""
    register_error.style.display = "none"
}

//API--------------------------------------------------------------------------------

//shared between login and register. 
//returns auth token
async function api_auth(endpoint, username, password)
{
    //Send a request to the API to get an auth token.
    try
    {
        const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password}),
        });
        return res;
    }
    catch(e)
    {
        //Server-side error. A null response should be treated as 
        //"could not reach server"
        return null;
    }
}

//Render-----------------------------------------------------------------------------

//Decides which subscreen to show based on token status and server reachability.
//Call this function to redraw the account tab.
export async function render_account()
{
    //Attempt to get auth token.
    const token = await get_token();

    //If no token is found, show login screen.
    if(!token)
    {
        console.log(`No token found`);
        show_unauthenticated_ui();
        account_show_screen("login");
        return;
    }

    //Check connection before showing main account screen.
    //If connection with server is not possible, show login screen.
    const connection_ok = await check_connection(); 
    if(connection_ok)
    {
        show_authenticated_ui();
        account_show_screen("main");
    }
    else
    {
        show_unauthenticated_ui();
        account_show_screen("login");
        account_show_error("Could not reach server.");
    }

}

//Init-------------------------------------------------------------------------------

//Called exactly ONCE
//All listeners are attached here
export function init_account()
{
    account_screen_login_btn.addEventListener("click", async() => {

        //get values from input fields
        //null-checking on both fields is done on the back end.
        const username = account_username_field.value.trim();
        const password = account_pass_field.value;

        //request token
        const res = await api_auth("login", username, password);
        if(!res) return account_show_error("Could not reach server.");

        const data = await res.json();
        //If response status code is outside the 200-299 range, something went wrong.
        //In that case, api attaches an "error" field to the response's json. Display it.
        if (!res.ok) return account_show_error(data.error || "Login failed.");

        //If successful, get token from respoonse.
        await set_token(data.token);

        //Then display main 
        show_authenticated_ui();
        account_show_screen("main");
        display_tab("collection");

        //And re-render the collection tab to display the new logged-in 
        //user's kanji collection
        render_collection();
    });

    account_register_btn.addEventListener("click", async() => {

        account_show_screen("register")
    });

    account_logout_btn.addEventListener("click", async() => {

        //clear auth token and show login screen.
        await clear_token();
        show_unauthenticated_ui();
        account_show_screen("login");
    });

    account_delete_btn.addEventListener("click", async () => {
        account_show_screen("delete");
    });

    account_change_pass_btn.addEventListener("click", async () => {
        account_show_screen("change-pass");
    });

    //Change Password----------------------------------------------------
    change_pass_back_btn.addEventListener("click", () => {

        //reset input field values
        reset_change_pass_screen();

        //return to main subscreen
        account_show_screen("main");
    });

    change_pass_submit_btn.addEventListener("click", async () => {

        //Get values from input fields
        const current_pass =     change_pass_current.value;
        const new_pass =        change_pass_new.value;
        const confirm_pass =    change_pass_confirm.value; 

        //Client-side field validation - make sure theyre not empty
        if(!current_pass || !new_pass || !confirm_pass)
        {
            change_pass_error.textContent = "Please fill in all fields";
            change_pass_error.style.display = "block";
            return;
        }

        //Check whether new password matches confirmation.
        if(new_pass !== confirm_pass)
        {
            change_pass_error.textContent = "New passwords do not match";
            change_pass_error.style.display = "block";
            return;
        }

        //Get token and send change pass request to server.
        const token = await get_token();
        try
        {
            //WIP: this could be made into a function and moved to api.js
            const res = await fetch(`${API_BASE}/auth/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({current_password: current_pass, new_password: new_pass})
            });

            //de-stringify response
            const data = await res.json();

            //If response status is outside 200-299 range:
            if(!res.ok)
            {
                change_pass_error.textContent = data.error || "Failed to change password.";
                change_pass_error.style.display = "block";
                return;
            }

            //If response is successful
            change_pass_error.style.color = "var(--text-default-color)";
            change_pass_error.textContent = "SUCCESS: Password changed successfully.";
            change_pass_error.style.display = "block";

            //Switch to main screen after a timeout.
            setTimeout(() => {
                change_pass_error.style.color = "";     //reset to CSS default
                reset_change_pass_screen();
                account_show_screen("main");
            }, 1500);
        }
        catch(e)
        {
            change_pass_error.textContent = e.message;
            change_pass_error.style.display = "block";
        }
    });

    //Delete Account-----------------------------------------------------

    delete_back_btn.addEventListener("click", () => {

        //Clear errors and go back to main subscreen
        delete_error.textContent = "";
        delete_error.style.display = "none";
        account_show_screen("main");
    });

    delete_confirm_btn.addEventListener("click", async () => {

        //get token 
        const token = await get_token();
        try
        {
            //send request to delete account
            const res = await fetch(`${API_BASE}/auth/account`, {
                method: "DELETE",
                headers: {"Authorization": `Bearer ${token}`},
            });

            //if response status is outside the OK range:
            if(!res.ok)
            {
                //Display error contained in response end return.
                const data = await res.json();
                delete_error.textContent = data.error || "Failed to delete account.";
                delete_error.style.display = "block";
                return;
            }

            //If successful, clear token and exit to login screen.
            await clear_token();
            show_unauthenticated_ui();
            account_show_screen("login");
        }
        catch(e)
        {
            delete_error.textContent = e.message;
            delete_error.style.display = "block";
        }
    });

    //Register Account-----------------------------------------------------

    register_btn.addEventListener("click", async() => {

        //get values from input fields and trim them
        const username = register_username.value.trim();
        const password = register_pass.value.trim();
        const password_repeat = register_pass_repeat.value.trim();

        //input check: make sure both passwords match
        if(password !== password_repeat) 
            return register_show_error("Passwords must match")

        //request auth token
        const res = await api_auth("register", username, password);
        if(!res) return register_show_error("Could not reach server.");

        //de-stringify response
        const data = await res.json();
        if(!res.ok) return register_show_error(data.error || "Registration failed.");

        //if response was ok, set auth token
        await set_token(data.token);

        //then display main subscreen
        show_authenticated_ui();
        account_show_screen("main");
        display_tab("collection");

        //And re-render the collection tab to display the new logged-in 
        //user's kanji collection
        render_collection();
    });
    
    register_back_btn.addEventListener("click", () => {

        reset_register_screen()
        account_show_screen("login")
    })
}
