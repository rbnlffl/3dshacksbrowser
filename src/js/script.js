'use strict';

Vue.config.devtools = false;
Vue.create = function(options) {
    return new Vue(options);
};

Vue.create({
    el: '#app',
    data: {
        user: '',
        userExists: 0,
        repo: '',
        repoExists: 0,
        shacks: []
    },
    methods: {
        checkUser: function() {
            if (this.user) {
                // this.$http.get(`https://api.github.com/users/${this.user}`).then(function(res) {
                    this.userExists = 1;
                // }, function(err) {
                //     this.userExists = -1;
                // });
            }
        },

        checkRepo: function() {
            if (this.repo) {
                // this.$http.get(`https://api.github.com/repos/${this.user}/${this.repo}`).then(function(res) {
                    this.repoExists = 1;
                // }, function(err) {
                //     this.repoExists = -1;
                // });
            }
        },

        checkRelease: function() {
            if (this.userExists === 1 && this.repoExists === 1) {
                this.$http.get(`https://api.github.com/repos/${this.user}/${this.repo}/releases/latest`).then(function(res) {
                    this.shacks = this.shacks.concat({
                        user: res.data.author.login,
                        userProfile: `https://github.com/${this.user}/`,
                        name: this.repo,
                        repo: `https://github.com/${this.user}/${this.repo}/`,
                        version: res.data.tag_name,
                        date: res.data.published_at,
                        download: res.data.assets[0].browser_download_url
                    });
                }, function(err) {
                    console.log(err.statusText);
                });
            }
        }
    }
});
