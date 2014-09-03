var app = app || {};
// tutor Model
// ----------

app.Cart = Backbone.Model.extend({

	defaults: {
		client: "", //MUid
		tutor: "",	//MUid
		course: "", 
		time: ""
	},
	
});