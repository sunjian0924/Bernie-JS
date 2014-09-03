var app = app || {};
// tutor Model
// ----------

app.WishList = Backbone.Model.extend({

	defaults: {
		client: "", //MUid
		tutor: "",	//MUid
		course: "", 
		time: ""
	},
	
});