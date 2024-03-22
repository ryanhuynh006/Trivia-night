const playButton = document.querySelector("#button")
const categorySelect = document.querySelector("#Categories")
const difficultySelect = document.querySelector("#Difficulty")
const gamemodeSelect = document.querySelector("#Gamemode")

// Returns an array of custom question
async function getSheetQuestions(amount) {
    const responce = await fetch(SHEET_URL)
    let jsonResponce = await responce.text()
    jsonResponce = jsonResponce.match("{.+}")
    jsonResponce = jsonResponce[0].replace(/\\/g, "")

    const sheetData = JSON.parse(jsonResponce);
    const sheetDataRows = sheetData.table.rows;

    let sheetQuestions = [];

    for (let i = 0; i < amount; i++) {
        let questionData = sheetDataRows[i]
        // If we have run out of question data break the loop (in case the amount is greater than the # of questions)
        if (!questionData) { break }
        questionData = questionData.c
        // Format data
        const question = {
            category: "custom",
            time: questionData[0].f,
            question: questionData[1].v,
            answer: questionData[2].v,
            wrongAnswers: [
                questionData[3].v,
                questionData[4].v,
                questionData[5].v,
            ],
            name: questionData[6].v,
        }
        sheetQuestions[i] = question
    }

    //Randomize question data

    return sheetQuestions
}

// Returns an array of trivia questions
async function getTriviaQuestions(amount, categoryNumber, difficulty) {
    //If there is no category set it to blank so it  doesn't try to load an invalid category
    let category = ""
    if (categoryNumber) {
        category = "&category=" + categoryNumber
    }

    //Properly configure trivia url to get the data we want
    const triviaUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}`+category;

    const responce = await fetch(triviaUrl)
    
    if (!responce || !responce.ok) {
        alert("Failed to load questions (try refreshing)");
        return false
    }

    const result = await responce.json()
    const triviaArray = result.results

    if (triviaArray.length == 0) {
        alert("No available questions!");
        return false
    }

    return triviaArray
}

// On user click load all of the questions
playButton.addEventListener("click", function () {
    const categoryOption = document.querySelector("#Categories option:checked")
    const categoryNumber = categoryOption.dataset.number

    const category = categorySelect.value
    const difficulty = difficultySelect.value
    const gamemode = gamemodeSelect.value

    console.log(categoryNumber)

    //Put data in query params for next page
    const settings = {
        categoryNumber: categoryNumber,
        category: category,
        difficulty: difficulty,
        gamemode: gamemode,
    };

    const urlParams = new URLSearchParams([
        ...Object.entries(settings),
    ]).toString();

    //Direct user to the next page
    window.location.href = "trivia.html?"+urlParams;
})

//If category is set to custom remove difficulty option
function updateDifficulty () {
    const div = difficultySelect.parentElement
    if (categorySelect.value === "Custom") {
        div.style.display = "none"
    } else {
        div.style.display = "block"
    }
}

updateDifficulty()
categorySelect.addEventListener("change", updateDifficulty)