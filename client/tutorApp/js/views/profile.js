var app = app || {}; 
app.ProfileView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#profile_template").html());
		this.$el.html(template);
	},
	events: {
		
	},
});

