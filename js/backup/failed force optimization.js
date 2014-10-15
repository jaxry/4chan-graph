tick:  function(animate) {
            for (var i = 0; i < verts.length; i++) {
                var v = verts[i];
                v.dispX = v.dispY = 0;
                for (var j = 0; j < verts.length; j++) {
                    if (i !== j) {
                        var u = verts[j];
                        var distance = v.distanceTo(u);
                        var dirX = (v.x - u.x) / distance, dirY = (v.y - u.y) / distance;
                        var r = repulse(distance);
                        v.dispX += dirX * r, v.dispY += dirY * r;
                    }
                }
            }



            for (var i = 0; i < verts.length; i++){
                verts[i].dispX = verts[i].dispY = 0;
            }

            for (var i = 0; i < verts.length; i++) {
                var v = verts[i];

                for (var j = i + 1; j < verts.length; j++) {
                    var u = verts[j];
                    var distance = v.distanceTo(u);
                    var dirX = (v.x - u.x) / distance, dirY = (v.y - u.y) / distance;
                    var r = repulse(distance);
                    v.dispX += dirX * r, v.dispY += dirY * r;
                    u.dispX -= dirX * r, u.dispY -= dirY * r;
                }
            }