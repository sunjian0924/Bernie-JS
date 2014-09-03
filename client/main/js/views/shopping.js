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
		if (app.objectBuffer.time_available === "default") {
			alert("choose a time!!");
		} else {
			//get data
			var item = app.Shoppings.findWhere({ owner: app.objectBuffer.owner });
			//change model
			if (item) {
				var attributes = item.attributes;
				if (attributes.course.length > 1) {
					var index1 = attributes.course.indexOf(app.objectBuffer.course);
					attributes.course.splice(index1, index1 + 1);
					var index2 = attributes.course.indexOf(app.objectBuffer.post_time);
					attributes.post_time.splice(index2, index2 + 1);
					var index3 = attributes.time_available.indexOf(app.objectBuffer.time_available);
					attributes.time_available.splice(index3, index3 + 1);
				} else {
					app.Shoppings.remove(item);
				}
			}
			//update view
			header_view.showShopping();
		}
	}
});

