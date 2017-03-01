var Connection = (function() {

    function Connection(username, relation, canvas, url) {
        this.username = username;
        this.relation = relation;
        this.canvas = canvas;
        this.open = false;
        this.socket = io.connect(url, {
            'force new connection': true,
            'reconnection delay': 3000,
            'reconnection limit': 100, 
            'max reconnection attempts': Infinity,
        });
        window.renderit = false;
    }
    return Connection;
})();
