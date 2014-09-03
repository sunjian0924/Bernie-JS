var app = app || {};
// client Model
// ----------

app.Client = Backbone.Model.extend({
	
	defaults: {
		MUid: "",
		username: "",
		course_taking: [], 
		course_chosen: [], 
		course_in_waitinglist: [],
		time_chosen: [],
		time_available: []
	},

});