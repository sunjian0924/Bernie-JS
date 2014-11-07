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
		"click #logout": "logout"
	},
	logout: function(event) {
		$.get('/logout', function(data) {
			console.log(data);
		});
	}
});

var login_view = new app.LoginView({el: $("#login_container")});

