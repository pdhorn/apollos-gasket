const solveDescartes = (a, b, c) => {
  const X = 1 / a + 1 / b + 1 / c;
  const Y = 1 / a ** 2 + 1 / b ** 2 + 1 / c ** 2;
  const Z = Math.sqrt(2 * X ** 2 - 2 * Y);
  return [(-X + Z) / (X ** 2 - 2 * Y), (-X - Z) / (X ** 2 - 2 * Y)];
};

// two circles and radius of 3rd MTC, return 2 circles forming MTC triple with two inputs
const pairAndRadiusTwoPossibilities = (
  firstCircle,
  secondCircle,
  newRadius
) => {
  const a = firstCircle.xTarget;
  const b = firstCircle.yTarget;
  const r = firstCircle.radius;
  const c = secondCircle.xTarget;
  const d = secondCircle.yTarget;
  const s = secondCircle.radius;
  const t = newRadius;
  const F =
    ((t + s) ** 2 - (r + t) ** 2 - (c - a) ** 2 - (d - b) ** 2) / (2 * (a - c));
  const A = ((d - b) / (c - a)) ** 2 + 1;
  const B = -((2 * F * (d - b)) / (c - a));
  const C = F ** 2 - (r + t) ** 2;
  const YOne = (-B + Math.sqrt(B ** 2 - 4 * A * C)) / (2 * A);
  const YTwo = (-B - Math.sqrt(B ** 2 - 4 * A * C)) / (2 * A);
  const [XOne, XTwo] = [YOne, YTwo].map((y) => ((b - d) / (c - a)) * y + F);
  return [
    [XOne, YOne],
    [XTwo, YTwo],
  ].map(([X, Y]) => ({ x: X + a, y: Y + b }));
};

const approxEqual = (a, b, epsilon) => {
  if (!epsilon) {
    epsilon = 0.000001;
  }
  return Math.abs(a - b) < epsilon;
};

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
    this.theta =
      (yTarget >= 0 ? 1 : -1) *
      Math.acos(xTarget / Math.sqrt(xTarget ** 2 + yTarget ** 2)); // check
    this.rendered = false;
  }

  isTangentTo = (anotherCircle) =>
    approxEqual(
      (this.radius + anotherCircle.radius) ** 2,
      (this.xTarget - anotherCircle.xTarget) ** 2 +
        (this.yTarget - anotherCircle.yTarget) ** 2
    ) ||
    approxEqual(
      (this.radius - anotherCircle.radius) ** 2,
      (this.xTarget - anotherCircle.xTarget) ** 2 +
        (this.yTarget - anotherCircle.yTarget) ** 2
    );
}

export class Triple {
  constructor([a, b, c]) {
    this.partOfOpenPlay = true;
    this.id = createID([a, b, c]);
  }

  setQuads([Q, P]) {
    this.quads = [Q, P];
  }

  updateOpen = () => {
    this.partOfOpenPlay = this.quads.some((q) => q.completed);
  };
}

export class Quad {
  constructor([a, b, c, d]) {
    this.completed = false;
    this.id = createID([a, b, c, d]);
  }

  diffQuadMinusTriple = (triple) => {
    const quadIDs = getCircleIDs(this.id);
    const tripleIDs = getCircleIDs(triple.id);
    const val = quadIDs.filter((x) => tripleIDs.includes(x));
    if (val.length === 1) {
      return val[0];
    } else {
      throw (
        "Quad " +
        this.id +
        " contains " +
        val.length +
        " circles not in triple " +
        triple.id
      );
    }
  };
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

    //todo calculate 4 & 5th circles (first time needs negative radius)
    const [R, S] = solveDescartes(
      -bigCircle.radius,
      firstCircle.radius,
      secondCircle.radius
    );

    var quads = [];
    [R, S].map((arr) =>
      pairAndRadiusTwoPossibilities(firstCircle, secondCircle, arr).map(
        (c, i) => {
          var z = new Circle(this.nextID(), arr, c.x, c.y);
          if (z.isTangentTo(bigCircle)) {
            this.circles.push(z);
            quads.push(new Quad([bigCircle, firstCircle, secondCircle, z]));
          }
        }
      )
    );
    this.quads = quads;
    var firstTriple = new Triple([bigCircle, firstCircle, secondCircle]);
    firstTriple.setQuads(quads);
    this.triples.push(firstTriple);
  }

  getCircleByID = (id) => this.circles.filter((c) => (c.id = id))[0];

  twoRadii = (triple) => {
    // given triple of MTCs, returns the radii of the two MTCs by Descartes' theorem
    const circleIDs = getCircleIDs(triple.id);
    const radii = circleIDs.map((id) => this.getCircleByID(id).radius);
    const [a, b, c] = radii;
  };
  nextID = () => this.circles.length;
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
