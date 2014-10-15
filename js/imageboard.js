var ns = ns || {};

//requires graphController and graphRenderer (graph.js)
ns.imageboard = (function() {
    'use strict';
    
    var postTemplate = document.getElementById('post-template');
    var boardUrl = '/a/';

    function randomPos(d) {
        return Math.random() * d - d / 2;
    }

    function getClass(h, c) {
        return h.getElementsByClassName(c)[0];
    }

    function makePostElement(post) {
        var elem = postTemplate.cloneNode(true);
        elem.removeAttribute('id');

        getClass(elem, 'postNum').innerHTML = 'No.' + post.no;
        getClass(elem, 'dateTime').innerHTML = post.now;
        getClass(elem, 'postMessage').innerHTML = post.com || '';
        getClass(elem, 'name').innerHTML = post.name;

        if (post.trip) getClass(elem, 'postertrip').innerHTML = post.trip;
        else getClass(elem, 'postertrip').remove();

        if (post.md5) {
            getClass(elem, 'fileText').innerHTML = 'File: <a href="">' + post.filename + post.ext + '</a> (' 
                                                   + Math.round(post.fsize / 1024) + ' KB, ' + post.w + 'x' + post.h + ')';
            // getClass(elem, 'fileThumb').innerHTML = '<img src="http://0.t.4cdn.org' + boardUrl + post.tim + 's.jpg"/>';
            getClass(elem, 'fileThumb').innerHTML = '<img src="http://i.4cdn.org' + boardUrl + post.tim + post.ext + '"/>';
        }
        else {
            getClass(elem, 'file').remove();
        }

        return elem;
    }

    var mouseHandler = new function() {
        var postHtml;
        this.onmouseover = function(e) {
            postHtml = e.target.vertexObj.imageboard.dom;
            document.body.appendChild(postHtml);
            e.target.addEventListener('mousemove', this.onmousemove);
        }.bind(this);
        this.onmouseout = function(e){
            document.body.removeChild(postHtml);
            e.target.removeEventListener('mousemove', this.onmousemove);
        }.bind(this);
        this.onmousemove = function(e) {
            postHtml.style.left = String(e.clientX + 8) + 'px';
            postHtml.style.top = String(e.clientY + 8) + 'px';
        }
    }();

    return {
        makeGraph: function(jsonThread, board) {
            boardUrl = board;
            
            var posts = jsonThread.posts,
                reQuotes = /<a href="#p(\d+)/g,
                lastUnrepliedComment = String(posts[0].no),
                vertex; 

            for (var i = 0; i < posts.length; i++) {
                var post = posts[i],
                    commentNumber = String(post.no),
                    comment = post.com,
                    match,
                    vertexNames = [];

                if (i == 0) {
                    vertex = ns.graph.createVertex({
                        name: commentNumber, 
                        x: randomPos(1), 
                        y: randomPos(1),
                        color: 'first'
                    });
                }

                else {
                    while(match = reQuotes.exec(comment)){
                        vertexNames.push(String(match[1]));
                    }

                    if (vertexNames.length > 0) {
                        vertex = ns.graph.createVertex({
                            name: commentNumber, 
                            x: randomPos(1), 
                            y: randomPos(1),
                            heads: vertexNames,
                            color: 'alternative'
                        });
                    }
                    else {
                        vertex = ns.graph.createVertex({
                            name: commentNumber, 
                            x: randomPos(1), 
                            y: randomPos(1),
                            heads: [lastUnrepliedComment],
                            color: 'default'
                        });

                        lastUnrepliedComment = commentNumber;
                    }
                }

                vertex.dom.addEventListener('mouseover', mouseHandler.onmouseover);
                vertex.dom.addEventListener('mouseout', mouseHandler.onmouseout);
                vertex.imageboard = {
                    dom: makePostElement(post)
                }
            }
        }
    };
})();