var app = app || {}; 
app.AdminView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		this.render();	
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
		//find MUid
		var tutor = app.Tutors.findWhere({ MUid: MUid});
		if (tutor) {
			tutor.attributes.expertises.push(expertise);
		} else if (MUid && expertise) {
			app.Tutors.add({
				MUid: MUid,
				username: '',
				expertises: [expertise]
			});
		}
		//update view
		header_view.showAdmin();		
	},
	deleteAdmin: function(event) {
		console.log("deleteAdmin");
		//get data
		console.log(app.objectBuffer);
		//change model
		//update view
		header_view.showAdmin();	
	}
});

