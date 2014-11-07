var app = app || {}; 
app.HomeView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#home_template").html());
		this.$el.html(template);
	},
	events: {
		
	},
});

