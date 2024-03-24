//The amount of questions generated when the user presses play (not custom)
const AMOUNT_OF_QUESTIONS = 20

//Perhaps in the future install gapi and use it to find a random scope within our data so we are not retrieving such a large amount of unused data
const SPREAD_ID = '1axUz3XAKfIoKwvIzTotC6ix2v5PZ_ucwpv2naZeSZsg'
const SHEET_NUMBER = '1107320111'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREAD_ID}/gviz/tq?tqx=out:json&headers=1&gid=${SHEET_NUMBER}`

//SOUNDS
const gameOver = document.getElementById("gameOver")
const rightSound = document.getElementById("rightSound")
const wrongSound = document.getElementById("wrongSound")

//ELEMENTS
const questionLabel = document.querySelector("#trivia-question")
const answerButtons = [
    document.querySelector("#answer-a"),
    document.querySelector("#answer-b"),
    document.querySelector("#answer-c"),
    document.querySelector("#answer-d"),
]
let countdownBar = document.getElementById('countdown-bar');

//VARIBLES
let width = 600; // Initial width of the bar

//Extract data from URL
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

//In future we can do away with category number for ease of use but for now who cares
const categoryNumber = searchParams.get("categoryNumber")
const category = searchParams.get("category")
const difficulty = searchParams.get("difficulty")
const gamemode = searchParams.get("gamemode")

let score = 0

// Returns an array of custom question
async function loadCustomQuestions() {
    const response = await fetch(SHEET_URL)
    let jsonResponse = await response.text()
    jsonResponse = jsonResponse.match("{.+}")
    jsonResponse = jsonResponse[0].replace(/\\/g, "")

    const sheetData = JSON.parse(jsonResponse);
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
    let category = " "
    if (categoryNumber) {
        category = "&category=" + categoryNumber
    }

    //Properly configure trivia url to get the data we want
    const triviaUrl = `https://opentdb.com/api.php?amount=${AMOUNT_OF_QUESTIONS}&type=multiple&difficulty=${difficulty.toLowerCase()}` + category;

    const response = await fetch(triviaUrl)
    
    if (!response || !response.ok) {
        alert("Failed to load question! (Too many requests)");
        window.location.href = "index.html";
    }

    const result = await response.json()
    const triviaArray = result.results

    if (triviaArray.length == 0) {
        alert("No available questions please select different options!");
        window.location.href = "index.html";
    }

    loadedQuestions = triviaArray

    return triviaArray
}

let loadingNext = false
for (let i = 0; i < answerButtons.length; i++) {
    const answer = answerButtons[i]
    answer.addEventListener("click", async function(){
        if (!rightAnswer) {
            console.warn("Right answer has not been added yet!");
            return
        }

        if (loadingNext) { return }

        loadingNext = true
        //CORRECT ANSWER
        if (answer === rightAnswer) {
            rightSound.play()
            width += 50;
            score++;
        //WRONG ANSWER
        }else {
            wrongSound.play()
            answer.style.backgroundColor = "red"
        }

        rightAnswer.style.backgroundColor = "green"
        await new Promise(resolve => setTimeout(resolve, 1500))
        answer.style.backgroundColor = ""
        rightAnswer.style.backgroundColor = ""
        nextQuestion()
        loadingNext = false
    })
}

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
    answerClone = [...answerButtons];

    rightAnswer = answerClone[randomNumber]
    rightAnswer.textContent = fixText(data.correct_answer)
    answerClone.splice(randomNumber, 1)

    for (let i = 0; i < answerClone.length; i++) {
        answerClone[i].textContent = fixText(data.incorrect_answers[i])
    }

    //Head to next question
    questionNumber++;
}

//Music config
let music
document.onclick= function(event) {
    if (music) { return }

    if (gamemode == "Timed") {
        music = document.getElementById("timedMusic"); 
    }else {
        music = document.getElementById("relaxingMusic"); 
    }
    music.volume = 0.2

    music.play();
};

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
        gameOver.play()
        if (music) {
            music.pause();
        }
        localStorage.setItem("score", score);
        console.log(localStorage.getItem("score"))
        alert("GAME OVER! SCORE: "+score)

        const urlParams = new URLSearchParams([
            ["score", score]
        ]).toString()

        window.location.href = "index.html?"+urlParams;
    }
} else {
    countdownBar.style.display = "none"
}

//Wait for questions to load before starting game
loadNewQuestions().then(nextQuestion)