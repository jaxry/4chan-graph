var ns = ns || {};

ns.graph = (function() { 
    'use strict';

    var svg = document.getElementById('svg'),
        container = document.getElementById('svg-container'),
        group = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g')),
        width, height,
        vertexCount = 0,
        verticesByName = {},
        vertices = [],
        edges = [];

    window.onresize = function(){
        width = parseInt(window.getComputedStyle(container).width);
        height = parseInt(window.getComputedStyle(container).height);
    };
    window.onresize();

    function getMousePos(x, y) {
        var m = group.getScreenCTM();
        return [(x - m.e) / m.d, (y - m.f) / m.d];
    }

    var dragHandler = new function() {
        var elem;
        this.onmousemove = function(e) {
            var p = getMousePos(e.clientX, e.clientY);
            elem.vertexObj.moveTo(p[0], p[1]);
        }.bind(this);
        this.onmousedown = function(e){
            elem = e.target;
            elem.parentNode.appendChild(elem);
            container.addEventListener('mousemove', this.onmousemove);
        }.bind(this);
        this.onmouseup = function(e){
            container.removeEventListener('mousemove', this.onmousemove);
        }.bind(this);
    }();

    var panHandler = new function() {
        var panX = 0, panY = 0, scale = 1, scaleAmount = 1.18, x0, y0;
        function setTransform() {
            group.setAttribute('transform', 'matrix(' + scale + ',0,0,' + scale + ',' + panX + ',' + panY + ')');
        }
        this.onmousemove = function(e) {
            panX += e.clientX - x0; 
            panY += e.clientY - y0;
            setTransform();

            x0 = e.clientX, y0 = e.clientY;
        }.bind(this);
        this.onmousedown = function(e){
            if (e.which === 3) {
                x0 = e.clientX, y0 = e.clientY;
                container.addEventListener('mousemove', this.onmousemove);
                container.style.cursor = 'move';
            }
        }.bind(this);
        this.onmouseup = function(e){
            if (e.which === 3) {
                container.removeEventListener('mousemove', this.onmousemove);
                container.style.cursor = null;
            }
        }.bind(this);
        this.onwheel = function(e, wheel) {
            var diffScale = wheel == 1 ? scaleAmount : 1 / scaleAmount;

            var rect = container.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            panX = x - diffScale * (x - panX);
            panY = y - diffScale * (y - panY); 
            scale *= diffScale;       
            setTransform();
        }.bind(this);
        this.centerOn = function(x, y) {
            panX = -x + width / 2; 
            panY = -y + height / 2;
            setTransform();
        };
    }();

    container.addEventListener('mousedown', panHandler.onmousedown);
    container.addEventListener('mouseup', panHandler.onmouseup);
    container.addEventListener('mousewheel', function(e){
        panHandler.onwheel(e, e.deltaY < 0 ? 1 : -1);
    });
    container.addEventListener('DOMMouseScroll', function(e){
        panHandler.onwheel(e, e.detail < 0 ? 1 : -1);
    });
    container.addEventListener('mouseup', dragHandler.onmouseup);

    return {
        createVertex: function(properties) {

            var vertex = new ns.Vertex(vertexCount++, properties.color || 'default');

            if (properties.heads) {
                properties.heads.forEach( function(headName) {
                    var head = verticesByName[headName];
                    edges.push({
                        'head': head,
                        'tail': vertex
                    });
                    group.insertBefore(vertex.connect(head), group.firstChild);
                    head.renderVertex();
                });
            }
        
            vertex.moveTo(properties.x, properties.y);
            vertex.dom.addEventListener('mousedown', dragHandler.onmousedown);

            vertices[vertex.id] = vertex;
            verticesByName[properties.name] = vertex;
            group.appendChild(vertex.dom);

            return vertex;
        },

        verticesByName: verticesByName,
        vertices: vertices,
        edges: edges,
        get width() {return width;},
        get height() {return height;},
        centerOn: panHandler.centerOn
    };
})();