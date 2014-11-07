var app = app || {}; 
app.AdminAppointmentsView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#admin_appointments_template").html());
		this.$el.html(template);
	},
	events: {
	},
});









