var app = app || {}; 
app.objectBuffer = {};
app.HeaderView = Backbone.View.extend({
	initialize: function() {

	},
	events: {
		"click #home" : "showHome",
		"click #profile": "showProfile",
		"click #admin_add_delete": "showAdminAddDel",
		"click #admin_match": "showAdminMatch",
		"click #admin_appointments": "showAdminAppointments",
		"click #admin_report": "showAdminReport",
	},
	showAdminReport: function(event) {
		this.redraw();
		var report_view = new app.AdminReportView({el: $("#admin_report_container")});
	},
	showHome: function(event) {
		this.redraw();
		var home_view = new app.HomeView({el: $("#home_container")});
	},
	showProfile: function(event) {
		this.redraw();
		var profile_view = new app.ProfileView({el: $("#profile_container")});
	},
	showAdminAddDel: function(event) {
		this.redraw();
		var admin_add_delete_view = new app.AdminAddDeleteView({el: $("#admin_add_delete_container")});
		$.get("/admin", function(tutors, textStatus) {
			if (textStatus === 'success') {
				for (var i = 0, n = tutors.length; i < n; i++) {
					var expertise = tutors[i].expertise;
					var MUid = tutors[i].MUid;
					$("#tutor_list").append('<tr><td class="MUid">' + MUid + '</td><td class="expertise">' + expertise + '</td><td><button class="button_delete">Delete</button></td></tr>');
				}
				$("button", $("#tutor_list")).unbind("click").click(function(e) {
					e.preventDefault();
					var me = $(this);
					app.objectBuffer = {
						MUid: $(".MUid", me.parent().parent())[0].innerHTML,
						expertise: $(".expertise", me.parent().parent())[0].innerHTML
					};
				});
			}
		});
	},
	showAdminMatch: function(event) {
		this.redraw();
		var admin_match_view = new app.AdminMatchView({el: $("#admin_match_container")});
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
					$("#matching_table").append('<tr><td class="owner">' + data.clientcourses[i].MUid + '</td><td class="course">' + data.clientcourses[i].courseID + '</td><td class="post_time">' + data.clientcourses[i].updated_at + '</td><td><button class="button_match">match</button></td></tr>');			
				}

				$("button", $("#matching_table")).unbind("click").click(function(e) {
					e.preventDefault();
					var me = $(this);
					app.objectBuffer = {
						owner: $(".owner", me.parent().parent())[0].innerHTML,
						course: $(".course", me.parent().parent())[0].innerHTML,
						post_time: $(".post_time", me.parent().parent())[0].innerHTML
					};
				});
			}
		});
	},
	showAdminAppointments: function(event) {
		this.redraw();
		var admin_appointmets_view = new app.AdminAppointmentsView({el: $("#admin_appointments_container")});
		$.get("/appointments", function(appointments, textStatus) {
			if (textStatus === 'success') {
				for (var i = 0, n = appointments.length; i < n; i++) {
					$("#admin_appointment_table").append('<tr><td class="tutor">' + appointments[i].MUid + '</td><td class="client">' + appointments[i].customer + '</td><td class="course">' + appointments[i].courseID + '</td><td class="time">' + appointments[i].time + '</td><td>' + appointments[i].updated_at + '</td></tr>');
				}
			}
		});
	},
	redraw: function() {
		$("#home_container").remove();
		$("#profile_container").remove();
		$("#admin_add_delete_container").remove();	
		$("#admin_match_container").remove();
		$("#admin_appointments_container").remove();
		$("#admin_report_container").remove();
		$("#containers").append('<div id="home_container"></div>');
		$("#containers").append('<div id="profile_container"></div>');
		$("#containers").append('<div id="admin_add_delete_container"></div>');	
		$("#containers").append('<div id="admin_match_container"></div>');
		$("#containers").append('<div id="admin_appointments_container"></div>');
		$("#containers").append('<div id="admin_report_container"></div>');
	}
});

var header_view = new app.HeaderView({el: $("#header")});


