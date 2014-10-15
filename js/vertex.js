var ns = ns || {};

(function(){
    'use strict';

    function makeElem(type, attrs) {
        var elem = document.createElementNS('http://www.w3.org/2000/svg', type);
        for (var a in attrs) {
            elem.setAttribute(a, String(attrs[a]));
        }
        return elem;
    }

    function Vertex(id, color) {
        this.id = id;
        this.x = 0;
        this.y = 0;
        this.heads = [];
        this.tails = [];
        this.dom = makeElem('circle', {
            'class': 'vertex',
            'r': ns.styles.vertex.r,
            'fill': ns.styles.color[color],
            'stroke': ns.styles.vertex.stroke,
            'stroke-width': ns.styles.vertex.strokeWidth
        });
        this.dom.vertexObj = this;
    }

    Vertex.prototype = {
        connect: function(head) {
            var edgeDom = makeElem('line', {
                'stroke': ns.styles.edge.stroke,
                'stroke-width': ns.styles.edge.strokeWidth,
                'marker-end': 'url(#arrow)'
            });

            this.heads.push({
                vertex: head,
                dom: edgeDom
            });
            head.tails.push({
                vertex: this,
                dom: edgeDom
            });

            return edgeDom;
        },

        renderVertex: function() {
            this.dom.setAttribute('transform', 'translate(' + this.x + ',' + this.y + ')');
            for (var i = 0; i < this.heads.length; i++) {
                var edgeDom = this.heads[i].dom;
                edgeDom.setAttribute('x2', this.x);
                edgeDom.setAttribute('y2', this.y);
            }
            for (var i = 0; i < this.tails.length; i++) {
                var edgeDom = this.tails[i].dom;
                edgeDom.setAttribute('x1', this.x);
                edgeDom.setAttribute('y1', this.y);
            }
        },

        move: function(dx, dy) {
            this.x += dx;
            this.y += dy;
            this.renderVertex();
        },
        moveTo: function(x, y) {
            this.x = x;
            this.y = y;
            this.renderVertex();
        },

        distanceTo: function(vertex) {
            return Math.sqrt(Math.pow(vertex.x - this.x, 2) + Math.pow(vertex.y - this.y, 2));
        },
        directionTo: function(vertex) {
            var x = vertex.x - this.x;
            var y = vertex.y - this.y;
            var distance = Math.sqrt(x*x + y*y);
            return {
                x: x / distance,
                y: y / distance,
                distance: distance
            }
        }
    }

    ns.Vertex = Vertex;
})();

