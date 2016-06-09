var app = app || {};

(function ($) {
	'use strict';

    // --------------
    // Resume View
    // --------------

    app.ResumeView = Backbone.View.extend({

        // Get existing DOM element
		el:  '.resume-container',

		// Cache the template function for a resume
		template: _.template($('#resume-template').html()),

		// The ResumeView listens for changes to its model, re-rendering.
		initialize: function () {

			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function () {

			this.$el.html(this.template(this.model.toJSON()));
			return this.$el;
		},

		// Remove the item, destroy the model and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
})(jQuery);