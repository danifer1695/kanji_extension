import { api_request } from "../shared/db.js";
import { choose_palette } from "../shared/palette.js";


//Elements--------------------------------------------------

const palette_dark =    document.getElementById("palette-dark");
const palette_light =   document.getElementById("palette-light");
const email_error =     document.getElementById("settings-email-error")
const email_conf =      document.getElementById("settings-email-confirmation")
const email_input =     document.getElementById("settings-email-input")
const email_btn =       document.getElementById("settings-email-btn")

//Palette---------------------------------------------------

//Map (dictionary) of button elements to theme name
const PALETTES = [
    [palette_dark, "default"],
    [palette_light, "default-light"]
];

function apply_palette(name)
{
    document.body.className = `theme-${name}`;
    choose_palette(name);
}

//Helpers---------------------------------------------------

function show_email_error(message)
{
    email_error.style.display = "flex"
    email_conf.style.display = "none"
    email_error.textContent = message
}

function show_email_confirmation(message)
{
    email_conf.style.display = "flex"
    email_error.style.display = "none"
    email_conf.textContent = message
}

//Init------------------------------------------------------

//Called once from the entry file (collection_popup.js)
export function init_settings()
{
    for( const [btn, name] of PALETTES)
    {
        btn.addEventListener("click", () => apply_palette(name));
    }

    //add email button submission event
    email_btn.addEventListener("click", async () => {

        const email = email_input.value.trim()

        //early return if field is empty
        if(!email) return show_email_error("Input field must not be empty")

        //send request 
        try {

            const res = await api_request('PATCH', '/auth/email', {email: email} )
            const data = await res.json()
            if(!res.ok) return show_email_error(data.error)
        } 
        catch(e) {

            return show_email_error(e.message)
        }

        show_email_confirmation("Email successfully updated")
    })
}
