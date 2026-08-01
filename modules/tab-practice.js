import { api_request } from "../shared/db.js";

//Local variables-------------------------------------------

let current_card_id = "";
let current_prompt_type = "";
let current_kanji = "";

//Elements--------------------------------------------------

const question_screen   = document.getElementById("practice-question-screen");
const feedback_screen   = document.getElementById("practice-feedback-screen");
const message_screen    = document.getElementById("practice-message-screen");

const question_prompt   = document.getElementById("practice-question-prompt");
const question_kanji    = document.getElementById("practice-question-kanji");
const question_input    = document.getElementById("practice-question-input");
const feedback_correct  = document.getElementById("practice-feedback-correct");
const feedback_accepted = document.getElementById("practice-feedback-accepted");
const feedback_kanji    = document.getElementById("practice-feedback-kanji");

const question_btn      = document.getElementById("practice-question-btn");
const feedback_btn      = document.getElementById("practice-feedback-btn");

const message_title     = document.getElementById("practice-message-title");
const message_subtitle  = document.getElementById("practice-message-subtitle");

//Helpters---------------------------------------------------------------------------

function show_screen(screen)
{
    if(!["message", "feedback", "question"].includes(screen))
    {
        console.error("collection_popup::show_screen: bad argument");
        return;
    }

    question_screen.style.display = 
        screen === "question" ? "flex" : "none";
    
    feedback_screen.style.display = 
        screen === "feedback" ? "flex" : "none";

    message_screen.style.display = 
        screen === "message" ? "flex" : "none";
}

function update_message(title, subtitle = "")
{
    message_title.textContent = title;
    message_subtitle.textContent = subtitle;
}

function formatDue(iso)
{
    const diffMs = new Date(iso).getTime() - Date.now();
    const hours = Math.round(diffMs / (1000 * 60 * 60));
    if(hours <= 0) return "shortly";
    if(hours < 24) return `in about ${hours}h`;
    const days = Math.round(hours / 24);
    return days === 1 ? "tomorrow" : `in ${days} days`;
}

//Render-----------------------------------------------------------------------------

export async function next_practice()
{
    //Show loading screen while data is loading
    update_message("Loading...");
    show_screen("message");

    //clear previous responses from input field
    question_input.value = "";

    //request content of next card
    const res = await api_request("GET", '/practice/next');
    
    //Early return if something goes wrong
    if(!res) { update_message("Oops.. Something happened."); return; }
    if(!res.ok) 
    { update_message("Opps...Something happened.", `${res.error}`); return; }

    //JSON-ify response, then get card
    const res_j = await res.json();
    
    //if card returns null, no reviews at this moment
    if(res_j.card === null)
    {
        //get next due at date and transform it into a readable date
        const next_raw = res_j.next_due_at;
        const next = formatDue(next_raw); 

        update_message("No reviews for now", `Next due ${next}`);
        return;
    }

    //fill question screen in with card data
    question_prompt.textContent = res_j.card.prompt_type === "meaning" ? 
        "Meaning" : "Reading";
    question_kanji.textContent = res_j.card.kanji;

    //keep relevant data in local variables
    current_card_id = res_j.card.id;
    current_kanji = res_j.card.kanji;
    current_prompt_type = res_j.card.prompt_type;

    //switch to practice screen
    show_screen("question");
}

async function get_feedback()
{    
    //do not process an empty string
    if(!question_input.value) return;

    //disable submit button during processing to prevent
    //multiple simultaneous requests
    question_btn.disabled = true;

    //get user's response from the input field
    const answer = question_input.value.trim();

    //send user's answer over to the server
    const res = await api_request("POST", `/practice/${current_card_id}/review`, {
        answer: answer,
        prompt_type: current_prompt_type
    }); 

    //check for bad responses
    if(!res) { update_message("Oops.. Something happened."); return; }
    if(!res.ok) 
    { update_message("Opps...Something happened.", `${res.error}`); return; }

    //update feedback screen with response's data
    const res_j = await res.json();
    feedback_correct.children[0].textContent = res_j.correct === true ?
        "Correct" : "Not quite";
    feedback_correct.style.background = res_j.correct === true ?
        "var(--correct)" : "var(--error)";
    feedback_accepted.textContent = res_j.accepted_answers.join(", ");
    feedback_kanji.textContent = current_kanji;

    //show screen
    show_screen("feedback");

    //re-enable question button (now hidden)
    question_btn.disabled = false;
}

//Init-------------------------------------------------------------------------------

//as all other init functions, it is only called once
export function init_practice()
{
    //set up all event listeners

    question_btn.addEventListener("click", async () => {
        get_feedback();
    })

    feedback_btn.addEventListener("click", async () => {
        next_practice();
    })
}
