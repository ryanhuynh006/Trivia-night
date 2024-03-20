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

const playButton = document.querySelector("#button")
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

async function getTriviaQuestions(amount, categoryNumber, difficulty) {
    let category = ""
    if (categoryNumber) {
        category = "&category=" + categoryNumber
    }

    const triviaUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}`+category;
    console.log(triviaUrl)

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