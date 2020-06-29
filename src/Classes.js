const createID = (arrayOfCircles) =>
  arrayOfCircles
    .map((x) => String(x.id))
    .sort((a, b) => a - b)
    .join("-");

const getCircleIDs = (id) => id.split("-").map((x) => parseInt(x));

const rotateByTheta = (x, y, theta) => ({
  x: x * Math.cos(theta) - y * Math.sin(theta),
  y: y * Math.cos(theta) + x * Math.sin(theta),
});

export class Circle {
  constructor(id, radius, xTarget, yTarget) {
    this.id = id;
    this.radius = radius;
    this.xTarget = xTarget;
    this.yTarget = yTarget;
    this.rendered = false;
  }
}

export class Triple {
  constructor([a, b, c]) {
    this.partOfOpenPlay = true;
    this.id = createID([a, b, c]);
  }

  setQuads([Q, P]) {
    this.quads = [Q, P];
  }
}

export class Quad {
  constructor([a, b, c, d]) {
    this.completed = false;
    this.id = createID([a, b, c, d]);
  }
}

export class Game {
  constructor() {
    this.circles = [];
    this.triples = [];
    this.quads = [];
    this.plays = 0;

    const outerRadius = 100;
    const minRadius = 20;
    var bigCircle = new Circle(0, outerRadius, 0, 0);
    this.circles.push(bigCircle);

    const theta = 2 * Math.PI * Math.random();
    const r = minRadius + (outerRadius - 2 * minRadius) * Math.random(); // radius of first circle
    var firstCircle = new Circle(
      1,
      r,
      (outerRadius - r) * Math.cos(theta),
      (outerRadius - r) * Math.sin(theta)
    );
    this.circles.push(firstCircle);

    const t = Math.max((outerRadius - r) * Math.random(), minRadius); //radius of second circle
    const signs = [1, -1];
    const sign = signs[Math.floor(Math.random() * signs.length)];
    let tx =
      ((outerRadius - r) ** 2 + (outerRadius - t) ** 2 - (t + r) ** 2) /
      (2 * (outerRadius - r));
    let ty = sign * Math.sqrt((outerRadius - t) ** 2 - tx ** 2);
    const { x, y } = rotateByTheta(tx, ty, theta);

    var secondCircle = new Circle(2, t, x, y);
    this.circles.push(secondCircle);

    //todo calculate 3 & 4th circles
    //todo create triple
    //todo create quad
  }
}

var a = new Circle(1, 2, 3, 4);
var b = new Circle(2, 2, 3, 4);
var c = new Circle(3, 2, 3, 4);
var d = new Circle(4, 2, 3, 4);
var e = new Circle(5, 2, 3, 4);

var q = new Quad([d, c, b, a]);
var p = new Quad([e, c, b, a]);

var t = new Triple([c, a, b]);
t.setQuads([q, p]);
