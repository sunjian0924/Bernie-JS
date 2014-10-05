var app = app || {}; 
app.AdminView = Backbone.View.extend({
	initialize: function() {
		this.render();		
	},
	render: function() {
		if (app.admin_type !== "matching") {
			var template = _.template($("#admin_add_delete_template").html());
			this.$el.html(template);
		} else {
			var template = _.template($("#admin_matching_template").html());
			this.$el.html(template);
		}
	},
	events: {
		"click #add_admin": "addAdmin",
		"click .button_delete": "deleteAdmin",
		"click #add_delete_switch": "addDelSwitch",
		"click #matching_switch": "matchingSwitch",
		"click .button_match": "match"
	},
	addDelSwitch: function(event) {
		app.admin_type = "add_delete";
		header_view.showAdmin();
	},
	matchingSwitch: function(event) {
		app.admin_type = "matching";
		header_view.showAdmin();
	},
	addAdmin: function(event) {
		event.preventDefault();
		var MUid = $(this.el).find('input#MUid').val();
		var expertise = $(this.el).find('input#expertise').val();
		//update database
		$.ajax({
			url: '/admin',
			type: 'post',
			data: {
				MUid: MUid,
				expertise: expertise
			},
			success: function() {
				//update view
				header_view.showAdmin();
			}
		});
				
	},
	deleteAdmin: function(event) {
		//get data
		$.ajax({
			url: '/admin',
			type: 'delete',
			data: {
				MUid: app.objectBuffer.MUid,
				expertise: app.objectBuffer.expertise
			},
			success: function() {
				//update view
				header_view.showAdmin();	
			}
		});
		
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
					header_view.showAdmin();
				}
			} 
		});
	}
});

