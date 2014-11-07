var app = app || {}; 
app.ShoppingView = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render: function() {
		var template = _.template($("#shopping_template").html());
		this.$el.html(template);
	},
	events: {
		"click .button_add_to_cart": "addToCart"
	},
	addToCart: function(event) {
		//check expertises
		if (app.cashedData.expertises.indexOf(app.objectBuffer.course) > -1) {
			if (app.objectBuffer.time === "default") {
				alert("choose a time!!");
			} else {
				//update database
				$.post('/cart', {
					MUid: app.cashedData.user,
					course: app.objectBuffer.course,
					owner: app.objectBuffer.owner,
					time: app.objectBuffer.time
				});
				$.ajax({
					url: '/shopping',
					type: 'delete',
					data: {
						owner: app.objectBuffer.owner,
						course: app.objectBuffer.course,
						time: app.objectBuffer.time
					},
					success: function() {
						//update view
						header_view.showShopping();
					}
				});		
			}
		} else {
			alert("you're not competent!!");
		}
	}
});

