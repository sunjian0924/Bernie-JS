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
		console.log("add to cart");
		//get data
		console.log(app.objectBuffer);
		//change model
		//update view
		header_view.showShopping();
	}
});

