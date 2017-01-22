'use strict';

Vue.config.devtools = false;
Vue.create = function(options) {
    return new Vue(options);
};

Vue.create({
    el: '#app',
    data: {
        newUser: {
            name: '',
            exists: undefined
        },
        newRepo: {
            name: '',
            exists: undefined
        },
        sorter: {
            property: '',
            desc: undefined
        },
        shacks: []
    },
    methods: {
        checkUser: function() {
            if (this.newUser.name) {
                axios.get(`https://api.github.com/users/${this.newUser.name}`).then((response) => {
                    this.newUser.exists = true;
                }).catch((error) => {
                    console.log(error.statusText || error.stack);
                    this.newUser.exists = false;
                });
            } else {
                this.newUser.exists = undefined;
            }
        },

        checkRepo: function() {
            if (this.newUser.exists && this.newRepo.name) {
                axios.get(`https://api.github.com/repos/${this.newUser.name}/${this.newRepo.name}`).then((response) => {
                    this.newUser.name = response.data.owner.login;
                    this.newRepo.name = response.data.name;
                    this.newRepo.exists = true;
                }).catch((error) => {
                    console.log(error.statusText || error.stack);
                    this.newRepo.exists = false;
                });
            } else {
                this.newRepo.exists = undefined;
            }
        },

        getRelease: function() {
            if (this.newUser.exists && this.newRepo.exists) {
                axios.get(`https://api.github.com/repos/${this.newUser.name}/${this.newRepo.name}/releases/latest`).then((response) => {
                    let dlType = response.data.assets[0].browser_download_url.match(/\.[a-z|0-9]+$/)[0].toLowerCase();

                    this.shacks = this.shacks.concat({
                        user: response.data.author.login,
                        userPage: response.data.author.html_url,
                        repo: this.newRepo.name,
                        repoPage: `https://github.com/${this.newUser.name}/${this.newRepo.name}`,
                        date: response.data.published_at,
                        download: `${response.data.tag_name.replace(/^v?/, '')} (${dlType})`,
                        downloadUrl: response.data.assets[0].browser_download_url,
                        qr: dlType === '.cia' ? true : false
                    });

                    this.newUser = {
                        name: '',
                        exists: undefined
                    };

                    this.newRepo = {
                        name: '',
                        exists: undefined
                    };
                }).catch((error) => {
                    console.log(error.statusText || error.stack);
                });
            }
        },

        sortBy: function(property) {
            if (property === 'user') {
                if (this.sorter.desc) {
                    this.shacks.sort((a, b) => {
                        return a.user.localeCompare(b.user);
                    });

                    this.sorter.desc = false;
                } else {
                    this.shacks.sort((a, b) => {
                        return b.user.localeCompare(a.user);
                    });

                    this.sorter.desc = true;
                }
            }

            if (property === 'repo') {
                if (this.sorter.desc) {
                    this.shacks.sort((a, b) => {
                        return a.repo.localeCompare(b.repo);
                    });

                    this.sorter.desc = false;
                } else {
                    this.shacks.sort((a, b) => {
                        return b.repo.localeCompare(a.repo);
                    });

                    this.sorter.desc = true;
                }
            }

            if (property === 'date') {
                if (this.sorter.desc) {
                    this.shacks.sort((a, b) => {
                        return a.date.localeCompare(b.date);
                    });

                    this.sorter.desc = false;
                } else {
                    this.shacks.sort((a, b) => {
                        return b.date.localeCompare(a.date);
                    });

                    this.sorter.desc = true;
                }
            }

            this.sorter.property = property;
        }
    },
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
