var app = app || {}; 
// Tutor Collection
// ---------------

// The collection of clients is backed by *localStorage* instead of a remote 
// server.
var CartList = Backbone.Collection.extend({
  // Reference to this collection's model.
	model: app.Cart,
	// Save all of the todo items under the `"clients"` namespace.
  // Note that you will need to have the Backbone localStorage plug-in
 	// loaded inside your page in order for this to work. If testing
  // in the console without this present, comment out the next line
  // to avoid running into an exception.
	localStorage: new Backbone.LocalStorage('carts'),
});
      // Create our global collection of **Todos**.
app.Carts = new CartList([
		{
			client: "sunj3", //MUid
			tutor: "tomj3",	//MUid
			course: "cse617", 
			time: "8-9am"
		}, 
		{
			client: "yan3",
			tutor: "sunj3",
			course: "cardriving123",
			time: "7-8pm"
		}
	]);





