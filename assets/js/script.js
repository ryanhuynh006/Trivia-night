const AMOUNT_OF_QUESTIONS = 10

//Using the google api we can define the scope of our search
//Perhaps in the future install gapi and use it to find a random scope within our data so we are not retrieving such a large amount
const SPREAD_ID = '1axUz3XAKfIoKwvIzTotC6ix2v5PZ_ucwpv2naZeSZsg'
const SHEET_NUMBER = '1107320111'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREAD_ID}/gviz/tq?tqx=out:json&headers=1&gid=${SHEET_NUMBER}`
const SHEET_OPTIONS = {
    method: "GET",
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
}

const playButton = document.querySelector("#play")
const difficultySelect = document.querySelector("#Difficulty")

async function getSheetQuestions() {
    const responce = await fetch(SHEET_URL, SHEET_OPTIONS)
    var jsonResponce = await responce.text()
    jsonResponce = jsonResponce.match("{.+}")
    jsonResponce = jsonResponce[0].replace(/\\/g, "")

    const sheetData = JSON.parse(jsonResponce)
    const sheetQuestions = sheetData.table.rows

    return sheetQuestions
}

getSheetQuestions()

async function getTriviaQuestions(amount, category, difficulty) {
    const triviaUrl = 'https://opentdb.com/api.php?type=multiple&amount='+amount+'&category='+category+'&difficulty='+difficulty;

    const responce = await fetch(triviaUrl)
    const result = await responce.json()
    const triviaArray = result.results

    console.log(triviaArray)

    return triviaArray
}

playButton.addEventListener("click", function () {
    const categoryOption = document.querySelector("#Categories option:checked")
    const category = categoryOption.dataset.number

    const difficulty = difficultySelect.value.toLowerCase()

    getTriviaQuestions(AMOUNT_OF_QUESTIONS, category, difficulty)
})