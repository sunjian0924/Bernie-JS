var app = app || {}; 
app.RegisterView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		if (app.register_type !== 'tutor') {
			var template = _.template($("#client_register_template").html());
			this.$el.html(template);
		} else {
			var template = _.template($("#tutor_register_template").html());
			this.$el.html(template);
		}
	},
	events: {
		"click #client_switch": "clientSwitch",
		"click #tutor_switch": "tutorSwitch",
		"click #moveright": "moveRight",
		"click #moveleft": "moveLeft",
		"click #client_addtime": "clientAddTime",
		"click #client_deletetime": "clientDeleteTime",
		"click #tutor_addtime": "tutorAddTime",
		"click #tutor_deletetime": "tutorDeleteTime",
		"click #client_register": "clientRegister",
		"click #tutor_register": "tutorRegister"
	},
	clientSwitch: function(event) {
		app.register_type = "client";
		header_view.showRegister();
	},
	tutorSwitch: function(event) {
		if (app.cashedData.usertype === 'tutor') {
			app.register_type = "tutor";
			header_view.showRegister();
		} else {
			alert("Sorry, you are not a tutor!");
		}
	},
	moveRight: function(event) {
		$.each($("#availableCourse").val(), function(index, object) {
      		$("#chosenCourse").append('<option value="' + object + '">' + object + '</option>');
      		$("#availableCourse option:selected").remove();
    });
	},
	moveLeft: function(event) {
		$.each($("#chosenCourse").val(), function(index, object) {
      		$("#availableCourse").append('<option value="' + object + '">' + object + '</option>');
      		$("#chosenCourse option:selected").remove();
    });
	},
	clientAddTime: function(event) {
		var options = [];
	    $("#client_availableTime option").each(function() {
	      options.push($(this).val());
	    });
	    $.each($("#client_Time").val(), function(index, object) {
	      if ($.inArray(object, options) == -1 && $.inArray(object, app.objectBuffer.notAvailable) == -1) {
	          $("#client_availableTime").append('<option value="' + object + '">' + object + '</option>');
	      } else {
	          alert("Time conflict!");
	      }
	    });
	},
	clientDeleteTime: function(event) {
    	$("#client_availableTime option:selected").remove();
	},
	clientRegister: function(event) {
		event.preventDefault();
		//get data
		var options1 = $("#chosenCourse")[0].options;
		var waitinglist = [];
		for (var i = 0, n = options1.length; i < n; i++) {
			waitinglist.push(options1[i].value);
		}
		var options2 = $("#client_availableTime")[0].options;
		var availableTime = [];
		for (var i = 0, n = options2.length; i < n; i++) {
			availableTime.push(options2[i].value);
		}
		$.ajax({
			url: '/register',
			type: 'put',
			data: {
				MUid: app.cashedData.user, //the user that is currently logged in
				waitinglist: JSON.stringify(waitinglist),
				availableTime: JSON.stringify(availableTime)
			},
			success: function() {
				//update view
				header_view.showRegister();
			}
		});		
	},
	tutorAddTime: function(event) {
		var options = [];
	    $("#tutor_availableTime option").each(function() {
	      options.push($(this).val());
	    });
	    $.each($("#tutor_Time").val(), function(index, object) {
	      if ($.inArray(object, options) == -1 && $.inArray(object, app.objectBuffer.notAvailable) == -1) {
	          $("#tutor_availableTime").append('<option value="' + object + '">' + object + '</option>');
	      } else {
	          alert("Time conflict!");
	      }
	    });
	},
	tutorDeleteTime: function(event) {
    	$("#tutor_availableTime option:selected").remove();
	},
	tutorRegister: function(event) {
		event.preventDefault();
		//get data
		var options = $("#tutor_availableTime")[0].options;
		var availableTime = [];
		for (var i = 0, n = options.length; i < n; i++) {
			availableTime.push(options[i].value);
		}
		$.ajax({
			url: '/tutor_register',
			type: 'put',
			data: {
				MUid: app.cashedData.user, //the user that is currently logged in
				availableTime: JSON.stringify(availableTime)
			},
			success: function() {
				//update view
				header_view.showRegister();
			}
		});
	}
});









