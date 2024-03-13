const category = 9
const amount = 10
const difficulty = "medium"
const url = 'https://opentdb.com/api.php?amount='+amount+'&category='+category+'&difficulty='+difficulty;


fetch(url).then(function(response){
    response.json().then(function(rawResult){
        const results = rawResult.results
        console.log(results)
    })
})