var app = app || {}; 
app.AppointmentsView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#appointments_template").html());
		this.$el.html(template);
	},
	events: {
		"click .button_cancel": "cancelSeries",
		"click .button_cancel_next_week": "cancelNextWeek"
	},
	cancelSeries: function(event) {
		//
		var response = confirm("Are you sure you want to cancel this appointment?");
		if (response) {
			$.ajax({
				url: '/appointment',
				type: 'delete',
				data: {
					tutor: app.objectBuffer.tutor,
					customer: app.cashedData.user, //the user who is currently logged in
					course: app.objectBuffer.course,
					time: app.objectBuffer.time
				},
				success: function() {
					header_view.showCart();	
				}
			});
			
			console.log("send emails to both client and tutor");
		}
		
	},
	cancelNextWeek: function(event) {
		//send email
		console.log("send emails to both client and tutor");
	}
});

