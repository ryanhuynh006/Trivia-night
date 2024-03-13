const category = "music"
const limit = 20
const url = 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia?category='+category+"&limit="+limit;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '90b033c257msha3ee08c8beb2838p1df284jsnd3b056d7391a',
		'X-RapidAPI-Host': 'trivia-by-api-ninjas.p.rapidapi.com'
	}
};

fetch(url, options).then(function(response){
    response.json().then(function(result){
        console.log(result)

        console.log(result[0].answer)
    })
})