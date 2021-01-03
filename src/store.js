var store = {
    state: {
        user: get('user'),
        jwt: get('jwt')
    },
    login(user, jwt) {
        this.state.user = user;
        set('user', user);
        set('jwt', jwt);
    },
    logout() {
        remove('user');
        remove('jwt');
    },
    getUser() {
        return get('user');
    },
    getJwt() {
        return get('jwt');
    }
} 

function get(key) {
    var jsonObject = window.localStorage.getItem(key);
    var jsonString = JSON.parse(jsonObject);
    return jsonString;
}

function set(key, value) {
    var jsonString = JSON.stringify(value);
    window.localStorage.setItem(key, jsonString);
}

function remove(key) {
    window.localStorage.removeItem(key);
}

export default store;