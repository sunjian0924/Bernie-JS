var app = app || {}; 
// Tutor Collection
// ---------------

// The collection of clients is backed by *localStorage* instead of a remote 
// server.
var ShoppingList = Backbone.Collection.extend({
  // Reference to this collection's model.
	model: app.Shopping,
	// Save all of the todo items under the `"clients"` namespace.
  // Note that you will need to have the Backbone localStorage plug-in
 	// loaded inside your page in order for this to work. If testing
  // in the console without this present, comment out the next line
  // to avoid running into an exception.
	localStorage: new Backbone.LocalStorage('shoppings'),
});
      // Create our global collection of **Todos**.
app.Shoppings = new ShoppingList();
app.Shoppings.add([
		{
			owner: "sunj3", //MUid
			course: ["cse617", "cse123"], 
			post_time: ["8:17pm 08/03/2014", "3:12am 08/23/2014"],
			time_available: ['3-4pm', '1-2am']
		}
	]);




