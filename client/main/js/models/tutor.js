var app = app || {};
// tutor Model
// ----------

app.Tutor = Backbone.Model.extend({

	defaults: {
		MUid: "",
		username: "",
		expertises: []
	},
	
});