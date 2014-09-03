var app = app || {}; 
app.CartView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#cart_template").html());
		this.$el.html(template);
	},
	events: {
		"click .button_cancel": "cancel",
		"click .button_cancel_next_week": "cancelNextWeek"
	},
	cancel: function(event) {
		console.log("cancel");
		//delete data from corresponding models
		//get data
		console.log(app.objectBuffer);
		header_view.showCart();	
	},
	cancelNextWeek: function(event) {
		console.log("cancel next week");
		//send email
		//get data
		console.log(app.objectBuffer);
	}
});

