/**
 * convert 2D array[[x1,y1],[x2,y2] to 3D extruded vertices[p5.Vector(x1,y1,top), p5.Vectorp5.Vector(x1,y1,bottom), p5.Vector(x2,y2,top), p5.Vectorp5.Vector(x2,y2,bottom)]
 * @method extrudePoints
 * param {Array} [[x1,y1],[x2,y2]] points to extrude
 * param {Integer} [top] z position
 * param {Integer} [bottom] z position
 * param {Boolean} [close] close the loop
 * @chainable
 */
p5.Geometry.prototype.extrudePoints = function(points, top, bottom, close) {
	points.forEach(p => {
		this.vertices.push(new p5.Vector(p[0], p[1], top));
	});
	if(close) this.vertices.push(new p5.Vector(points[0][0], points[0][1], top));
	points.forEach(p => {
		this.vertices.push(new p5.Vector(p[0], p[1], bottom));
	});
	if(close) this.vertices.push(new p5.Vector(points[0][0], points[0][1], bottom));
	return this;
}

/**
 * convert compute texture coordinates
 * @method computeUVs
 * @chainable
 */
p5.Geometry.prototype.computeUVs = function(repeatX, repeatY) {
	this.uvs.length = 0
	
	for (var y = 0; y <= this.detailY; y++) {
		var u = (1 - y / this.detailY) * repeatX;
		for (var x = 0; x <= this.detailX; x++) {
			var v = x / this.detailX * repeatY;
			this.uvs.push(u, v);
		}
	}
	return this;
}