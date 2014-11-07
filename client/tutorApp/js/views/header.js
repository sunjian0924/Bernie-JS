var app = app || {}; 
app.objectBuffer = {};
app.HeaderView = Backbone.View.extend({
	initialize: function() {

	},
	events: {
		"click #home" : "showHome",
		"click #profile": "showProfile",
		"click #register": "showRegister",
		"click #shopping": "showShopping",
		"click #cart": "showCart",
	},
	showHome: function(event) {
		this.redraw();
		var home_view = new app.HomeView({el: $("#home_container")});
	},
	showProfile: function(event) {
		this.redraw();
		var profile_view = new app.ProfileView({el: $("#profile_container")});
	},
	showRegister: function(event) {
		this.redraw();
		var register_view = new app.RegisterView({el: $("#register_container")});
		if (app.register_type !== 'tutor') {
			$.get('/clienttimes/' + app.cashedData.user + '/notAvailable', function(data, textStatus) {
				if (textStatus === 'success') {
					app.objectBuffer.notAvailable = [];
					for (var i = 0, n = data.length; i < n; i++) {
						app.objectBuffer.notAvailable.push(data[i].time);
					}
				}
			});
			//retrieve current user's info
			$.get('/register/' + app.cashedData.user, function(data, textStatus) {
				if (textStatus === 'success') {
					var courses_taking = [];
					for (var i = 0, n = data.courses_taking.length; i < n; i++) {
						courses_taking.push(data.courses_taking[i].courseID);
					}
					var courses_in_waitinglist = [];
					for (var i = 0, n = data.courses_in_waitinglist.length; i < n; i++) {
						courses_in_waitinglist.push(data.courses_in_waitinglist[i].courseID);
					}
					var courses_chosen = [];
					for (var i = 0, n = data.courses_times_chosen.length; i < n; i++) {
						courses_chosen.push(data.courses_times_chosen[i].courseID);
					}
					var times_available = [];
					for (var i = 0, n = data.times_available.length; i < n; i++) {
						times_available.push(data.times_available[i].time);
					}

					var course_not_chosen = _.difference(courses_taking, _.union(courses_in_waitinglist, courses_chosen));

					for (var i = 0, n = course_not_chosen.length; i < n; i++) {
						$("#availableCourse").append('<option value=' + course_not_chosen[i] + '>' + course_not_chosen[i] + '</option>');
					}
					for (var i = 0, n = courses_in_waitinglist.length; i < n; i++) {
						$("#chosenCourse").append('<option value=' + courses_in_waitinglist[i] + '>' + courses_in_waitinglist[i] + '</option>');
					}
					for (var i = 0, n = times_available.length; i < n; i++) {
						$("#client_availableTime").append('<option value=' + times_available[i] + '>' + times_available[i] + '</option>');
					}
				}
			});
		} else {
			$.get("/tutortimes/" + app.cashedData.user + "/available", function(data, textStatus) {
				if (textStatus === 'success') {
					var times_available = [];
					for (var i = 0, n = data.length; i < n; i++) {
						times_available.push(data[i].time);
					}
					for (var i = 0, n = times_available.length; i < n; i++) {
						$("#tutor_availableTime").append('<option value=' + times_available[i] + '>' + times_available[i] + '</option>');
					}
				}
			});
		}
	},
	showShopping: function(event) {
		this.redraw();
		var shopping_view = new app.ShoppingView({el: $("#shopping_container")});
		$.get('/shopping', function(data, textStatus) {
			if (textStatus === 'success') {
				var times = {};
				for (var i = 0, n = data.clienttimes.length; i < n; i++) {
					if (!times[data.clienttimes[i].MUid]) {
						times[data.clienttimes[i].MUid] = [data.clienttimes[i].time];
					} else {
						times[data.clienttimes[i].MUid].push(data.clienttimes[i].time);
					}
				}
				var MUids = [];
				for (var i = 0, n = data.clientcourses.length; i < n; i++) {
					if (MUids.indexOf(data.clientcourses[i].MUid) === -1) {
						MUids.push(data.clientcourses[i].MUid);
					}
					if (!data.clientcourses[i]['times']) {
						data.clientcourses[i]['times'] = times[data.clientcourses[i].MUid];
					}
				}

				for (var i = 0, m = data.clientcourses.length; i < m; i++) {	
					$("#shopping_table").append('<tr><td class="owner">' + data.clientcourses[i].MUid + '</td><td class="course">' + data.clientcourses[i].courseID + '</td><td class="post_time">' + data.clientcourses[i].updated_at + '</td><td class="time"><select name="time" class="' + data.clientcourses[i].MUid + '"><option value="default">select a time</option></select></td><td><button class="button_add_to_cart">Add to Cart</button></td></tr>');	
					
				}
			
				for (var i = 0, m = MUids.length; i < m; i++) {
					for (var j = 0, n = times[MUids[i]].length; j < n; j++) {
						$("." + MUids[i]).append('<option value=' + times[MUids[i]][j] + '>' + times[MUids[i]][j] + '</option>');
					}
				}

				$("button", $("#shopping_table")).unbind("click").click(function(e) {
					e.preventDefault();
					var me = $(this);
					app.objectBuffer = {
						owner: $(".owner", me.parent().parent())[0].innerHTML,
						course: $(".course", me.parent().parent())[0].innerHTML,
						post_time: $(".post_time", me.parent().parent())[0].innerHTML,
						time: $("." + $(".owner", me.parent().parent())[0].innerHTML, me.parent().parent())[0].options[$("." + $(".owner", me.parent().parent())[0].innerHTML, me.parent().parent())[0].selectedIndex].value
					};
				});
			}
		});
	},
	showCart: function(event) {
		this.redraw();
		var cart_view = new app.CartView({el: $("#cart_container")});
		$.get("/cart/" + app.cashedData.user, function(cart, textStatus, jqXHR) {
			if (textStatus === 'success') {
				for (var i = 0, n = cart.length; i < n; i++) {
					$("#cart_table").append('<tr><td class="tutor">' + cart[i].MUid + '</td><td class="course">' + cart[i].courseID + '</td><td class="time">' + cart[i].time + '</td><td class="cancel"><button class="button_cancel">Cancel Series</button></td><td class="cancel_next_week"><button class="button_cancel_next_week">Cancel Next Week</button></td></tr>');
				}
				$("button", $("#cart_table")).unbind("click").click(function(e) {
					e.preventDefault();
					var me = $(this);
					app.objectBuffer = {
						tutor: $(".tutor", me.parent().parent())[0].innerHTML,
						course: $(".course", me.parent().parent())[0].innerHTML,
						time: $(".time", me.parent().parent())[0].innerHTML
					};
				});
			}
		});
		
	},
	redraw: function() {
		$("#home_container").remove();
		$("#profile_container").remove();
		$("#register_container").remove();	
		$("#cart_container").remove();
		$("#shopping_container").remove();
		$("#containers").append('<div id="home_container"></div>');
		$("#containers").append('<div id="profile_container"></div>');
		$("#containers").append('<div id="register_container"></div>');	
		$("#containers").append('<div id="cart_container"></div>');
		$("#containers").append('<div id="shopping_container"></div>');
	}
});

var header_view = new app.HeaderView({el: $("#header")});


