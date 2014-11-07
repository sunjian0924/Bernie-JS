var app = app || {}; 
app.LogoutView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#logout_template").html());
		this.$el.html(template);
	},
	events: {
	},
});

var logout_view = new app.LogoutView({el: $("#logout_container")});


