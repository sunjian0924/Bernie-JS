var app = app || {}; 
app.AdminAddDeleteView = Backbone.View.extend({
	initialize: function() {
		this.render();		
	},
	render: function() {
		var template = _.template($("#admin_add_delete_template").html());
		this.$el.html(template);
	},
	events: {
		"click #add_tutor": "addTutor",
		"click .button_delete": "deleteTutor",
	},
	addTutor: function(event) {
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
				header_view.showAdminAddDel();
			}
		});				
	},
	deleteTutor: function(event) {
		//get data
		var response = confirm("Are you sure you want to delete this tutor?");
		if (response) {
			$.ajax({
				url: '/admin',
				type: 'delete',
				data: {
					MUid: app.objectBuffer.MUid,
					expertise: app.objectBuffer.expertise
				},
				success: function() {
					//update view
					header_view.showAdminAddDel();	
				}
			});
		}
	}
});

