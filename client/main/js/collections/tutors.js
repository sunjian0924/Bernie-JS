var app = app || {}; 
// Tutor Collection
// ---------------

// The collection of clients is backed by *localStorage* instead of a remote 
// server.
var TutorList = Backbone.Collection.extend({
  // Reference to this collection's model.
	model: app.Tutor,
	// Save all of the todo items under the `"clients"` namespace.
  // Note that you will need to have the Backbone localStorage plug-in
 	// loaded inside your page in order for this to work. If testing
  // in the console without this present, comment out the next line
  // to avoid running into an exception.
	localStorage: new Backbone.LocalStorage('tutors'),
});
      // Create our global collection of **Todos**.
app.Tutors = new TutorList();





