var app = app || {}; 
app.AdminMatchView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#admin_match_template").html());
		this.$el.html(template);
	},
	events: {
		"click .button_match": "match"
	},
	match: function(event) {
		$.ajax({
			url: '/matchings/' + app.objectBuffer.owner + '/' + app.objectBuffer.course,
			type: 'get',
			success: function(data) {
				//show match result
				if (data.fail) {
					alert("No matches found!");
				} else {
					alert("Matched with " + data.MUid + " at " + data.time);
					header_view.showAdminMatch();
				}
			} 
		});
	}
});

