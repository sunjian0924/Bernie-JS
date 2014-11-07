var app = app || {};
//store tutors' expertises information in it 
app.cashedData = {
	expertises: [],
	user: null,
	type: null
};
$.get('/whoami', function(data, textStatus) {
	if (textStatus === "success") {
		app.cashedData.user = data.username;
		app.cahsedData.type = data.usertype;
		$.get('/expertises/' + app.cashedData.user, function(data, textStatus) {
			if (textStatus === "success") {
				for (var i = 0, n = data.length; i < n; i++) {
					app.cashedData.expertises.push(data[i].expertise);
				}
			}
		});
	}
});
