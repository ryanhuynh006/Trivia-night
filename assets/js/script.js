const settings = {
	async: true,
	crossDomain: true,
	url: 'https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ba151ed912msh57f6efac4ca623cp1768e5jsn4be1685ac01d',
		'X-RapidAPI-Host': 'trivia-by-api-ninjas.p.rapidapi.com'
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});