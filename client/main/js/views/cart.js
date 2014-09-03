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
		//get data
		var item = app.Carts.findWhere({ 
			tutor: app.objectBuffer.tutor, 
			course: app.objectBuffer.course,
			time: app.objectBuffer.time
		});
		if (item) {
			app.Carts.remove(item);
		}
		console.log("send emails to both client and tutor");
		header_view.showCart();	
	},
	cancelNextWeek: function(event) {
		//send email
		console.log("send emails to both client and tutor");
		//get data
		console.log(app.objectBuffer);
	}
});

