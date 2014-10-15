ns.forceDirect = (function() {
    // var idealLength = Math.sqrt(width * height / Object.keys(graphHandler.vertices).length) / 1.5;

    var idealLength = 50;
    var tempMax = 450;
    var tempMin = 0.2;
    
    var temperature = tempMax;
    var decay = 1;
    var edges = [], verts = [], disp = [];

    function loadGraph() {
        edges = ns.graphController.edges,
        verts = ns.graphController.vertices;
        for (var i = 0; i < verts.length; i++){
            disp[i] = {};
        }
    }

    function repulse(z) {
        return idealLength * idealLength / z;
    }

    function attract(z) {
        return z * z / idealLength;
    }

    function compute(render) {
      for (var i = 0; i < verts.length; i++){
            disp[i].x = disp[i].y = 0;
        }

        for (var i = 0; i < verts.length; i++) {
            var v = verts[i];
            var dv = disp[i];
            for (var j = i + 1; j < verts.length; j++) {
                var u = verts[j];
                var du = disp[j];
                var distance = v.distanceTo(u);
                var dirX = (v.x - u.x) / distance, dirY = (v.y - u.y) / distance;
                var r = repulse(distance);
                dv.x += dirX * r, dv.y += dirY * r;
                du.x -= dirX * r, du.y -= dirY * r;
            }
        }

        for (var i = 0; i < edges.length; i++) {
            var h = edges[i].head, t = edges[i].tail;
            var dh = disp[h.id], dt = disp[t.id];
            var distance = h.distanceTo(t);
            var dirX = (h.x - t.x) / distance, dirY = (h.y - t.y) / distance;
            var a = attract(distance);
            dh.x -= dirX * a, dh.y -= dirY * a;
            dt.x += dirX * a, dt.y += dirY * a;
        }

        for (var i = 0; i < verts.length; i++) {
            var v = verts[i];
            var dv = disp[i];

            var distToCenter = Math.sqrt(v.x * v.x + v.y * v.y);
            var a = attract(distToCenter) / 120;
            dv.x -= v.x / distToCenter * a, dv.y -= v.y / distToCenter * a;

            var magDisp = Math.sqrt(dv.x * dv.x + dv.y * dv.y);
            dv.x = dv.x / magDisp * Math.min(temperature, magDisp), dv.y = dv.y / magDisp * Math.min(temperature, magDisp);

            if (render) {
                v.move(dv.x, dv.y); 
            }
            else {
                v.x += dv.x, v.y += dv.y;
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

        iterate: function(iterations) {
            loadGraph();
            decay = Math.pow(tempMin / tempMax, 1 / iterations);
            for (var i = 0; i < iterations; i++) {
                compute(false);
            }
            compute(true);
        }
    };
})();