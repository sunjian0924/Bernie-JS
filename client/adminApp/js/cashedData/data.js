var app = app || {};
//store tutors' expertises information in it 
app.cashedData = {
	user: null,
};
$.get('/whoami', function(data, textStatus) {
	if (textStatus === "success") {
		app.cashedData.user = data;
	}
});
