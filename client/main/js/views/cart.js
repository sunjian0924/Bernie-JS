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
		//
		$.ajax({
			url: '/cart',
			type: 'delete',
			data: {
				tutor: app.objectBuffer.tutor,
				customer: "sunj3", //the user who is currently logged in
				course: app.objectBuffer.course,
				time: app.objectBuffer.time
			},
			success: function() {
				header_view.showCart();	
			}
		});
		
		console.log("send emails to both client and tutor");
		
	},
	cancelNextWeek: function(event) {
		//send email
		console.log("send emails to both client and tutor");
	}
});

