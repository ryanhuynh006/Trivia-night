const CATEGORY = 9
const AMOUNT = 10
const DIFFICULTY = "medium"

const SPREAD_ID = '1axUz3XAKfIoKwvIzTotC6ix2v5PZ_ucwpv2naZeSZsg'
const SHEET_NUMBER = '1107320111'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREAD_ID}/gviz/tq?tqx=out:json&headers=1&gid=${SHEET_NUMBER}`
const SHEET_OPTIONS = {
    method: "GET",
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
}

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
    const triviaUrl = 'https://opentdb.com/api.php?amount='+amount+'&category='+category+'&difficulty='+difficulty;

    const responce = await fetch(triviaUrl)
    const result = await responce.json()
    const triviaArray = result.results

    console.log(triviaArray)

    return triviaArray
}

getTriviaQuestions(AMOUNT, CATEGORY, DIFFICULTY)