var app = app || {};
// tutor Model
// ----------

app.Shopping = Backbone.Model.extend({

	defaults: {
		owner: "", //MUid
		course: [], 
		post_time: [],
		time_available: []
	},
	
});