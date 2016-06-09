var app = app || {};

(function($) {
    'use strict';

    // ---------------
    // App View
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    app.AppView = Backbone.View.extend({

        // Get existing DOM element
        el: '.b-github-resume',

        events: {
            'click .cta-username': 'getUserInfo',
            'keyup #fld-username': 'checkInputLength',
            'click .btn-view_task': 'toggleTask'
        },

        initialize: function() {

            this.$input = this.$('#fld-username');
            this.$cta = this.$('.cta-username');
            this.$container = this.$('.resume-container');
            this.$error = this.$('.error');
            this.apiUrl = "https://api.github.com/users/";
        },

        // On CTA click create "Resume" model,
        getUserInfo: function() {

            var that = this;
            var inputVal = this.$input.val();

            if (inputVal.length === 0) {
                console.warn('Please enter valid username');
                return false;
            }

            $.ajax({
                url: this.apiUrl + inputVal,
            }).success(function(response) {

                // Since default properties of model are same as API response, lets push that JSON to model
                var resumeModel = new app.Resume(response);
                if (!response.public_repos) {
                    that.$error
                        .text('User has no repositories!')
                        .addClass('is-visible');
                    return;
                }

                var view = new app.ResumeView({ model: resumeModel });
                that.$container.html(view.render());

            }).fail(function() {

                // Sometimes Fail can occur due to exceed limit of API calls (max 60 pro hour),
                // but i'll ignore that, and send you this warning anyway :)
                that.$error
                    .text('You\'ve entered non-existing user! Please try again')
                    .addClass('is-visible');
                console.warn('You\'ve entered non-existing username');
            });
        },

        checkInputLength: function() {
            if (this.$error.hasClass('is-visible')) {
                this.$error.removeClass('is-visible');
            }
            this.$cta.prop('disabled', this.$input.val().length === 0);
        },

        toggleTask: function() {
            $('.task-description').toggleClass('is-visible');
        }

    });
})(jQuery);
