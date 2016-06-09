var app = app || {};

(function() {
    'use strict';

    // ----------
    // Resume Model
    // ----------

    // Our basic **Resume** model has `title`, `order`, and `completed` attributes.
    app.Resume = Backbone.Model.extend({
        // Default attributes for the Resume; Some will be used in rendering template
        defaults: {
            name: '',
            location: '',
            avatar_url: '',
            public_repos: '',
            repos_url: '',
            languages: {}
        },

        initialize: function() {

            if (this.get('repos_url').length) {

                this.userRepos = [];

                // call method = start collecting repos
                this.getLanguages(1);
            }
        },

        sortLanguages: function(repositories) {
            var usedLanguages = {};

            // Go trough repo list and count them by language
            _.each(repositories, function(repo) {
                var repoLanguage = repo.language;

                if (typeof repoLanguage == 'string' && repoLanguage.length) {

                    // If it exists count one more, else add in list
                    if (repoLanguage in usedLanguages) {
                        usedLanguages[repoLanguage]++;

                    } else {
                        usedLanguages[repoLanguage] = 1;
                    }
                }
            });

            this.set('languages', usedLanguages);
        },

        getLanguages: function(pageNum) {

            pageNum = pageNum || 1;

            var that = this;

            /** Default settings for getting peros is 30 items per call.
             * Query strings "page" and "per_page" can be set to get all pages as quickly as possible
             * @info: https://developer.github.com/v3/#pagination
             */
            $.ajax({
                url: this.get('repos_url') + '?page=' + pageNum + '&per_page=100'
            }).success(function(repositories) {

                that.userRepos.push.apply(that.userRepos, repositories);

                // Stop getting new repositories if last call is not full,
                // otherwise continue with pagination
                if (repositories.length < 100) {
                    that.sortLanguages(that.userRepos);
                } else {
                    that.getLanguages(pageNum + 1);
                }
            });
        }
    });
})();
