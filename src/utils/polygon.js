/**
 * Check if a point (px, py) is inside a polygon
 * defined by an array of [x, y] points.
 */
export const isPointInPolygon = (point, vs) => {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

export const getPolygonBoundary = (polygon) => {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  // 1. Find min/max X and Y
  for (const [x, y] of polygon) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // 2. Compute width and height of bounding box
  const width = maxX - minX;
  const height = maxY - minY;
  console.log("width", width, "height", height);
  console.log("minX", minX, "minY", minY);
  console.log("maxX", maxX, "maxY", maxY);
  // 3. Use the larger dimension as the square’s side length
  const side = Math.max(width, height);

  // 4. Construct the square corners (clockwise or counter-clockwise)
  const boundingSquare = [
    [minX, minY], // bottom-left
    [minX, maxY], // bottom-right
    [maxX, maxY], // top-right
    [maxX, minY], // top-left
  ];

  return boundingSquare;
};
