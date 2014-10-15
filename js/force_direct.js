var ns = ns || {};

//requires graphController (graph.js)
ns.forceDirect = (function() {
    'use strict';

    var idealLength = 40;
    var tempMax = 450;
    var tempMin = 0.2;
    
    var temperature = tempMax;
    var decay = 1;
    var edges = [], verts = [];

    function loadGraph() {
        edges = ns.graph.edges,
        verts = ns.graph.vertices;
    }

    function repulse(z) {
        return idealLength * idealLength / z;
    }

    function attract(z) {
        return z * z / idealLength;
    }

    function compute(render) {
      for (var i = 0; i < verts.length; i++) {
            verts[i].dispX = verts[i].dispY = 0;
        }

        for (var i = 0; i < verts.length; i++) {
            var v = verts[i];
            for (var j = i + 1; j < verts.length; j++) {
                var u = verts[j];
                var dir = u.directionTo(v);
                var r = repulse(dir.distance);
                v.dispX += dir.x * r, v.dispY += dir.y * r;
                u.dispX -= dir.x * r, u.dispY -= dir.y * r;
            }
        }

        for (var i = 0; i < edges.length; i++) {
            var h = edges[i].head, t = edges[i].tail;
            var dir = t.directionTo(h);
            var a = attract(dir.distance);
            h.dispX -= dir.x * a, h.dispY -= dir.y * a;
            t.dispX += dir.x * a, t.dispY += dir.y * a;
        }

        for (var i = 0; i < verts.length; i++) {
            var v = verts[i];

            var distToCenter = Math.sqrt(v.x * v.x + v.y * v.y);
            var a = attract(distToCenter) / 1000;
            v.dispX -= v.x / distToCenter * a, v.dispY -= v.y / distToCenter * a;

            var magDisp = Math.sqrt(v.dispX * v.dispX + v.dispY * v.dispY);
            v.dispX = v.dispX / magDisp * Math.min(temperature, magDisp), v.dispY = v.dispY / magDisp * Math.min(temperature, magDisp);

            if (render) {
                v.move(v.dispX, v.dispY); 
            }
            else {
                v.x += v.dispX, v.y += v.dispY;
            }
        }
        temperature = Math.max(temperature *= decay, tempMin);
    }

    function animate() {
        compute(true);
        requestAnimationFrame(function() {
            animate();
        });
    }

    return {
        tick: function(render) {
            loadGraph();
            compute(render);
        },

        animate: function() {
            loadGraph();
            animate();
        },

        iterate: function(iterations, temp) {
            loadGraph();
            tempMax = temp;
            decay = Math.pow(tempMin / tempMax, 1 / iterations);
            for (var i = 0; i < iterations; i++) {
                compute(false);
            }
            compute(true);
        }
    };
})();
