var app = app || {};
//store tutors' expertises information in it 
app.cashedData = {
	expertises: [],
	user: null,
};
$.get('/expertises/sunj3', function(data, textStatus) {
	if (textStatus === "success") {
		for (var i = 0, n = data.length; i < n; i++) {
			app.cashedData.expertises.push(data[i].expertise);
		}
	}
});
$.get('/whoami', function(data, textStatus) {
	if (textStatus === "success") {
		app.cashedData.user = data;
	}
});