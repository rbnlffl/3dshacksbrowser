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
        shacks: [],
        sortUserDesc: undefined,
        sortRepoDesc: undefined,
        sortDateDesc: undefined
    },
    methods: {
        checkUser: function() {
            if (this.user) {
                this.$http.get(`https://api.github.com/users/${this.user}`).then(function(res) {
                    this.userExists = 1;
                }, function(err) {
                    this.userExists = -1;
                });
            } else {
                this.userExists = 0;
            }
        },

        checkRepo: function() {
            if (this.repo) {
                this.$http.get(`https://api.github.com/repos/${this.user}/${this.repo}`).then(function(res) {
                    this.repoExists = 1;
                    this.user = res.data.owner.login;
                    this.repo = res.data.name;
                }, function(err) {
                    this.repoExists = -1;
                });
            } else {
                this.repoExists = 0;
            }
        },

        checkRelease: function() {
            if (this.userExists === 1 && this.repoExists === 1) {
                this.$http.get(`https://api.github.com/repos/${this.user}/${this.repo}/releases/latest`).then(function(res) {
                    this.shacks = this.shacks.concat({
                        user: res.data.author.login,
                        userPage: res.data.author.html_url,
                        repo: this.repo,
                        repoPage: `https://github.com/${this.user}/${this.repo}`,
                        version: res.data.tag_name,
                        date: res.data.published_at,
                        download: res.data.assets[0].browser_download_url
                    });

                    this.user = '';
                    this.userExists = 0;
                    this.repo = '';
                    this.repoExists = 0;
                }, function(err) {
                    console.log(err.statusText);
                });
            }
        },

        sortBy: function(property) {
            if (property === 'user') {
                if (this.sortUserDesc) {
                    this.shacks.sort((a, b) => {
                        return a.user.localeCompare(b.user);
                    });

                    this.sortUserDesc = false;
                } else {
                    this.shacks.sort((a, b) => {
                        return b.user.localeCompare(a.user);
                    });

                    this.sortUserDesc = true;
                }
            }

            if (property === 'repo') {
                if (this.sortRepoDesc) {
                    this.shacks.sort((a, b) => {
                        return a.repo.localeCompare(b.repo);
                    });

                    this.sortRepoDesc = false;
                } else {
                    this.shacks.sort((a, b) => {
                        return b.repo.localeCompare(a.repo);
                    });

                    this.sortRepoDesc = true;
                }
            }

            if (property === 'date') {
                if (this.sortDateDesc) {
                    this.shacks.sort((a, b) => {
                        return a.repo.localeCompare(b.repo);
                    });

                    this.sortDateDesc = false;
                } else {
                    this.shacks.sort((a, b) => {
                        return b.repo.localeCompare(a.repo);
                    });

                    this.sortDateDesc = true;
                }
            }
        }
    },
    mounted: function() {},
    filters: {
        date: function(value) {
            let date = new Date(value),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear();

            return `${day < 10 ? '0' + day : day}.${(month + 1) < 10 ? '0' + (month + 1) : (month + 1)}.${year}`;
        }
    }
});
