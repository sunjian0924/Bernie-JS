var app = app || {}; 
app.AdminView = Backbone.View.extend({
	initialize: function() {
		this.render();	
		//add listeners to corresponding collections and models
		
	},
	render: function() {
		var template = _.template($("#admin_template").html());
		this.$el.html(template);
	},
	events: {
		"click #add_admin": "addAdmin",
		"click button": "deleteAdmin"
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
		
	}
});

