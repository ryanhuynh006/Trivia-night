//The amount of questions generated when the user presses play (not custom)
const AMOUNT_OF_QUESTIONS = 20

//Perhaps in the future install gapi and use it to find a random scope within our data so we are not retrieving such a large amount of unused data
const SPREAD_ID = '1axUz3XAKfIoKwvIzTotC6ix2v5PZ_ucwpv2naZeSZsg'
const SHEET_NUMBER = '1107320111'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREAD_ID}/gviz/tq?tqx=out:json&headers=1&gid=${SHEET_NUMBER}`

const questionLabel = document.querySelector("#trivia-question")
const anwserButtons = [
    document.querySelector("#answer-a"),
    document.querySelector("#answer-b"),
    document.querySelector("#answer-c"),
    document.querySelector("#answer-d"),
]

// Returns an array of custom question
async function loadCustomQuestions() {
    const responce = await fetch(SHEET_URL)
    let jsonResponce = await responce.text()
    jsonResponce = jsonResponce.match("{.+}")
    jsonResponce = jsonResponce[0].replace(/\\/g, "")

    const sheetData = JSON.parse(jsonResponce);
    const sheetDataRows = sheetData.table.rows;

    let sheetQuestions = [];

    for (let i = 0; i < sheetDataRows.length; i++) {
        let questionData = sheetDataRows[i]
        // If we have run out of question data break the loop (in case the amount is greater than the # of questions)
        if (!questionData) { break }
        questionData = questionData.c
        // Format data
        const question = {
            category: "custom",
            time: questionData[0].f,
            question: questionData[1].v,
            correct_answer: questionData[2].v,
            incorrect_answers: [
                questionData[3].v,
                questionData[4].v,
                questionData[5].v,
            ],
            name: questionData[6].v,
        }
        sheetQuestions[i] = question
    }

    //Randomize question order?

    loadedQuestions = sheetQuestions
}

// Returns an array of trivia questions
async function loadQuestions(categoryNumber, difficulty) {
    //If there is no category set it to blank so it  doesn't try to load an invalid category
    let category = ""
    if (categoryNumber) {
        category = "&category=" + categoryNumber
    }

    //Properly configure trivia url to get the data we want
    const triviaUrl = `https://opentdb.com/api.php?amount=${AMOUNT_OF_QUESTIONS}&type=multiple&difficulty=${difficulty.toLowerCase()}` + category;

    const responce = await fetch(triviaUrl)
    
    if (!responce || !responce.ok) {
        alert("Failed to load question! (Too many requests)");
        window.location.href = "index.html";
    }

    const result = await responce.json()
    const triviaArray = result.results

    if (triviaArray.length == 0) {
        alert("No available questions please select different options!");
        window.location.href = "index.html";
    }

    loadedQuestions = triviaArray

    return triviaArray
}

for (let i = 0; i < anwserButtons.length; i++) {
    const answer = anwserButtons[i]
    answer.addEventListener("click", function(){
        if (!rightAnswer) {
            console.warn("Right answer has not been added yet!");
            return
        }

        if (answer === rightAnswer) {
            alert("CORRECT")
            nextQuestion()
        }else {
            alert("INCORRECT")
        }
    })
}

//Extract data from URL
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

//In future we can do away with category number for ease of use but for now who cares
const categoryNumber = searchParams.get("categoryNumber")
const category = searchParams.get("category")
const difficulty = searchParams.get("difficulty")
const gamemode = searchParams.get("gamemode")

function loadNewQuestions() {
    let loadPromise
    if (category === "Custom") {
        console.log("Loading custom question")
        loadPromise = loadCustomQuestions()
    } else {
        console.log("Loading normal question")
        loadPromise = loadQuestions(categoryNumber, difficulty)
    }
    
    return loadPromise;
}

function fixText(mystring) {
    return mystring.replace(/&quot;/g,'"');
}

let rightAnswer
let questionNumber = 0
let loadedQuestions = []
//Load the right questions based on the category
function nextQuestion () {
    //Get page data
    let data = loadedQuestions[questionNumber]

    if (!data) {
        questionLabel.textContent = "Loading Trivia Questions"
        loadNewQuestions().then(nextQuestion)
    }

    questionLabel.textContent = fixText(data.question)

    let randomNumber = Math.floor(Math.random() * 4) //between 0 and 3
    anwserClone = [...anwserButtons];

    rightAnswer = anwserClone[randomNumber]
    rightAnswer.textContent = fixText(data.correct_answer)
    anwserClone.splice(randomNumber, 1)

    for (let i = 0; i < anwserClone.length; i++) {
        anwserClone[i].textContent = fixText(data.incorrect_answers[i])
    }

    //Head to next question
    questionNumber++;
}

//Music config
document.onclick= function(event) {
    let music

    if (gamemode == "Timed") {
        music = document.getElementById("timedMusic"); 
    }else {
        music = document.getElementById("relaxingMusic"); 
    }
    music.volume = 0.2

    music.play();
};


let countdownBar = document.getElementById('countdown-bar');
let width = 600; // Initial width of the bar

if (gamemode == "Timed") {
    let interval = setInterval(function() {
        width--;
        countdownBar.style.width = width + 'px';
        if (width == 0) {
            endGame()
        }
    }, 100); // Update every 0.1 seconds

    function endGame() {
        clearInterval(interval);
        console.log("GAME OVER")
        alert("GAME OVER")
        window.location.href = "index.html";
    }
} else {
    countdownBar.style.display = "none"
}

//Wait for questions to load before starting game
loadNewQuestions().then(nextQuestion)