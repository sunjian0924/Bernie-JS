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
		"click #admin": "showAdmin"
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
		//retrieve current user's info
		var client_info = app.Clients.models[0];
		var course_taking = client_info.attributes.course_taking;
		var course_chosen = client_info.attributes.course_chosen.concat(client_info.attributes.course_in_waitinglist);

		var course_not_chosen = _.difference(course_taking, course_chosen);
		for (var i = 0, n = course_not_chosen.length; i < n; i++) {
			$("#availableCourse").append('<option value=' + course_not_chosen[i] + '>' + course_not_chosen[i] + '</option>');
		}
		var course_in_waitinglist = client_info.attributes.course_in_waitinglist;
		for (var i = 0, n = course_in_waitinglist.length; i < n; i++) {
			$("#chosenCourse").append('<option value=' + course_in_waitinglist[i] + '>' + course_in_waitinglist[i] + '</option>');
		}
		var time_available = client_info.attributes.time_available;
		for (var i = 0, n = time_available.length; i < n; i++) {
			$("#availableTime").append('<option value=' + time_available[i] + '>' + time_available[i] + '</option>');
		}
	},
	showShopping: function(event) {
		this.redraw();
		var shopping_view = new app.ShoppingView({el: $("#shopping_container")});
		var shoppings = app.Shoppings.models;
		for (var i = 0, m = shoppings.length; i < m; i++) {
			var courses = shoppings[i].attributes.course;
			for (var j = 0, n = courses.length; j < n; j++) {
				$("#shopping_table").append('<tr><td class="owner">' + shoppings[i].attributes.owner + '</td><td class="course">' + shoppings[i].attributes.course[j] + '</td><td class="post_time">' + shoppings[i].attributes.post_time[j] + '</td><td class="time"><select name="time" class="time_chosen"><option value="default">select a time</option></select></td><td><button class="button_add_to_cart">Add to Cart</button></td></tr>');	
			}
			var times_chosen = shoppings[i].attributes.time_available;
			for (var k = 0, o = times_chosen.length; k < o; k++) {
				$(".time_chosen").append('<option value=' + times_chosen[k] + '>' + times_chosen[k] + '</option>');
			}
		}
		$("button", $("#shopping_table")).unbind("click").click(function(e) {
			e.preventDefault();
			var me = $(this);
			app.objectBuffer = {
				owner: $(".owner", me.parent().parent())[0].innerHTML,
				course: $(".course", me.parent().parent())[0].innerHTML,
				post_time: $(".post_time", me.parent().parent())[0].innerHTML,
				time_available: $(".time_chosen", me.parent().parent())[0].options[$(".time_chosen", me.parent().parent())[0].selectedIndex].value
			};
		});
	},
	showCart: function(event) {
		this.redraw();
		var cart_view = new app.CartView({el: $("#cart_container")});
		var carts = app.Carts.models;
		for (var i = 0, n = carts.length; i < n; i++) {
			$("#cart_table").append('<tr><td class="tutor">' + carts[i].attributes.tutor + '</td><td class="course">' + carts[i].attributes.course + '</td><td class="time">' + carts[i].attributes.time + '</td><td class="cancel"><button class="button_cancel">Cancel</button></td><td class="cancel_next_week"><button class="button_cancel_next_week">Cancel Next Week</button></td></tr>');
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
	},
	showAdmin: function(event) {
		this.redraw();
		var admin_view = new app.AdminView({el: $("#admin_container")});
		var tutors = app.Tutors.models;
		for (var i = 0, n = tutors.length; i < n; i++) {
			var expertises = tutors[i].attributes.expertises;
			var MUid = tutors[i].attributes.MUid;
			for (var j = 0, m = expertises.length; j < m; j++) {
				$("#tutor_list").append('<tr><td class="MUid">' + MUid + '</td><td class="expertise">' + expertises[j] + '</td><td><button class="button">Delete</button></td></tr>');
			}
		}
		$("button", $("#tutor_list")).unbind("click").click(function(e) {
			e.preventDefault();
			var me = $(this);
			app.objectBuffer = {
				MUid: $(".MUid", me.parent().parent())[0].innerHTML,
				expertise: $(".expertise", me.parent().parent())[0].innerHTML
			};
		});	
	},
	redraw: function() {
		$("#home_container").remove();
		$("#profile_container").remove();
		$("#register_container").remove();	
		$("#cart_container").remove();
		$("#shopping_container").remove();
		$("#admin_container").remove();
		$("#containers").append('<div id="home_container"></div>');
		$("#containers").append('<div id="profile_container"></div>');
		$("#containers").append('<div id="register_container"></div>');	
		$("#containers").append('<div id="cart_container"></div>');
		$("#containers").append('<div id="shopping_container"></div>');
		$("#containers").append('<div id="admin_container"></div>');
	}
});

var header_view = new app.HeaderView({el: $("#header")});


