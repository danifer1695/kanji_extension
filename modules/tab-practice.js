
//Elements--------------------------------------------------

const question_screen   = document.getElementById("practice-question-screen");
const feedback_screen   = document.getElementById("practice-feedback-screen");
const message_screen    = document.getElementById("practice-message-screen");

const message_title     = document.getElementById("practice-message-title");
const message_subtitle  = document.getElementById("practice-message-subtitle");

//Switching subscreens---------------------------------------------------------------

function show_screen(screen)
{
    question_screen.style.display = 
        screen === "question" ? "flex" : "none";
    
    feedback_screen.style.display = 
        screen === "feedback" ? "flex" : "none";

    message_screen.style.display = 
        screen === "message" ? "flex" : "none";
}

function update_message(title, subtitle)
{
    message_title.textContent = title;
    message_subtitle.textContent = subtitle;
}

//Render-----------------------------------------------------------------------------

export function render_practice()
{
    update_message("Loading...",  "");
    show_screen("message");

    //Placeholder to test show_screen.
    setTimeout(() => {
        show_screen("question");
    }, 2500);
}
