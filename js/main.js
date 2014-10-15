var ns = ns || {};

(function() {
'use strict';

var thread = ns.threadLoader.load(''); // board url here
ns.imageboard.makeGraph(thread, ''); //board letter here
ns.forceDirect.iterate(10000, 500);

var op = ns.graph.vertices[0];
ns.graph.centerOn(op.x, op.y);
ns.forceDirect.animate();


})();