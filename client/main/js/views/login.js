var app = app || {}; 
app.LoginView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#login_template").html());
		this.$el.html(template);
	},
	events: {
	},
});

var login_view = new app.LoginView({el: $("#login_container")});
$("#whologgedin").append(app.cashedData.user)

