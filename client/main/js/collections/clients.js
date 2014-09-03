var app = app || {}; 
// Client Collection
// ---------------

// The collection of clients is backed by *localStorage* instead of a remote 
// server.
var ClientList = Backbone.Collection.extend({
  // Reference to this collection's model.
	model: app.Client,
	// Save all of the todo items under the `"clients"` namespace.
  // Note that you will need to have the Backbone localStorage plug-in
 	// loaded inside your page in order for this to work. If testing
  // in the console without this present, comment out the next line
  // to avoid running into an exception.
	localStorage: new Backbone.LocalStorage('clients'),
});
      // Create our global collection of **Todos**.
app.Clients = new ClientList([
		{
			MUid: 'sunj3', 
			username: 'sunjian', 
			course_taking: ['cse123', 'cse234', 'cse432'],
			course_chosen: ['cse234'],
			course_in_waitinglist: ['cse123'],
			time_chosen: ['2-3am', '4-5am'],
			time_available: ['2-3am']
		}
	]);





