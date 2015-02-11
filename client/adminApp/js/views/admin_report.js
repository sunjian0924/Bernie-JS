var app = app || {}; 
app.AdminReportView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#admin_report_template").html());
		this.$el.html(template);
	},
	events: {
		"click #reportG": "reportG",
	},
	reportG: function(event) {
		event.preventDefault();
		var file = $("#inputReport")[0].files[0];
		// Create a new FormData object.
		var formData = new FormData();
		formData.append("file", file);
		$.ajax({
	        url: '/report',
	        data: formData,
	        contentType: false,
    		processData: false,
	        type: 'POST',
	        success: function (data) {
	        	data = data.split('\n')[0];
	        	var href = "/downloads/" + data + "." + "csv";
	        	$("#download").append('<button class="buttonMain"><a href=' + href + ' download>Download Report</button>');
	        }
	    });
	}
});

