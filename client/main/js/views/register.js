var app = app || {}; 
app.RegisterView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#register_template").html());
		this.$el.html(template);
	},
	events: {
		"click #moveright": "moveRight",
		"click #moveleft": "moveLeft",
		"click #addtime": "addTime",
		"click #deletetime": "deleteTime",
		"click #register": "register"
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
	addTime: function(event) {
		var options = [];
    $("#availableTime option").each(function() {
      options.push($(this).val());
    });
    $.each($("#Time").val(), function(index, object) {
      if ($.inArray(object, options) == -1) {
          $("#availableTime").append('<option value="' + object + '">' + object + '</option>');
      } else {
          alert("Time conflict!");
      }
    });
	},
	deleteTime: function(event) {
    $("#availableTime option:selected").remove();
	},
	register: function(event) {
		event.preventDefault();
		//get data
		var options1 = $("#chosenCourse")[0].options;
		var waitinglist = [];
		for (var i = 0, n = options1.length; i < n; i++) {
			waitinglist.push(options1[i].value);
		}
		var options2 = $("#availableTime")[0].options;
		var availableTime = [];
		for (var i = 0, n = options2.length; i < n; i++) {
			availableTime.push(options2[i].value);
		}
		$.ajax({
			url: '/register',
			type: 'put',
			data: {
				MUid: "sunj3", //the user that is currently logged in
				waitinglist: JSON.stringify(waitinglist),
				availableTime: JSON.stringify(availableTime)
			},
			success: function() {
				//update view
				header_view.showRegister();
			}
		});
		
	}
});









