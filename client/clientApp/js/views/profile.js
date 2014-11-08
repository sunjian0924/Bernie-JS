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
		"click #update_profile" : "updateProfile"
	},
	updateProfile: function(event) {
		var response = confirm("This action will update your profile and course information, continue?");
		if (response) {
			 $.ajax({
			 	dataType: "jsonp",
			  	url: "https://portlet.admin.miamioh.edu/MyCourses/course/userData?term=201420",
			  	success: function(data) {
			  		var courses = [];
			  		$.each(data["taking"], function(index, value) {
			  			courses.push(value["subject"] + value["number"]);
			  		});
			  		console.log(courses);
				  	$.ajax({
						type: "POST",
					  	url: "/courses/" + app.cashedData.user,
					  	data: 
					  	{
					  		courses: JSON.stringify(courses)
					  	},
					  	success: function(data) {
					  		alert("Update success!");
					  	}
					});
				}
			});

		}
	}
});

