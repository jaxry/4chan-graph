var ns = ns || {};

ns.threadLoader = (function() {
    'use strict';
    
    function urlHtmlToJson(url){
        var match = url.match(/boards.4chan.org(\/\w+\/)thread\/(\d+)/),
            board = match[1],
            thread = match[2];
        var jsonUrl = 'http://a.4cdn.org' + board + 'thread/' + thread + '.json';
        return jsonUrl;
    }

    var request = new XMLHttpRequest();

    // request.onreadystatechange = function() {
    //     console.log(request.response);
    // }

    return {
        load: function(url) {
            var jsonUrl = urlHtmlToJson(url);
            request.open('GET', 'https://jsonp.nodejitsu.com/?url=' + jsonUrl, false);
            request.send();
            return JSON.parse(request.response);
        }

    }
})();