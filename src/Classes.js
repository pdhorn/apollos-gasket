const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
  const r = firstCircle.id !== 0 ? firstCircle.radius : -firstCircle.radius;
  const c = secondCircle.xTarget;
  const d = secondCircle.yTarget;
  const s = secondCircle.id !== 0 ? secondCircle.radius : -secondCircle.radius;
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
    this.render = false;
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
    this.partOfOpenPlay = !this.quads.every((q) => q.completed);
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
    const val = quadIDs.filter((x) => !tripleIDs.includes(x));
    if (val.length === 1) {
      return parseInt(val[0]);
    } else {
      throw RangeError(
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
  constructor(pixels) {
    console.log("New Game");
    this.circles = [];
    this.triples = [];
    this.quads = [];
    this.plays = 0;

    const outerRadius = (pixels - 20) / 2;
    const minRadius = 30;
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
    const sign = randomChoice(signs);
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
      pairAndRadiusTwoPossibilities(firstCircle, secondCircle, arr).map((c) => {
        var z = new Circle(this.nextID(), arr, c.x, c.y);
        if (z.isTangentTo(bigCircle)) {
          this.circles.push(z);
          quads.push(new Quad([bigCircle, firstCircle, secondCircle, z]));
        }
        return true;
      })
    );
    this.quads = quads;
    var firstTriple = new Triple([bigCircle, firstCircle, secondCircle]);
    firstTriple.setQuads(quads);
    firstTriple.maxradiusplay = Math.max(...this.twoRadii(firstTriple));
    this.triples.push(firstTriple);
    [bigCircle, firstCircle, secondCircle].map((c) => {
      c.render = true;
      return true;
    });
  }

  giveNextPlay = () => {
    let T =
      Math.random() < 0.75
        ? this.triples
            .filter((t) => t.partOfOpenPlay)
            .sort((a, b) => b.maxradiusplay - a.maxradiusplay)[0]
        : randomChoice(this.triples.filter((t) => t.partOfOpenPlay));
    let Q = randomChoice(T.quads.filter((q) => !q.completed));
    let C = this.getCircleByID(Q.diffQuadMinusTriple(T));
    let play = { circle: C, triple: T, quad: Q };
    this.play = play;
    return C;
  };

  executePlay = () => {
    this.plays = this.plays + 1;
    // render circle
    this.play.circle.render = true;
    // update quad
    this.play.quad.completed = true;
    // update triple
    this.play.triple.updateOpen();
    // generate new quads and stuff
    var three = getCircleIDs(this.play.triple.id).map((i) =>
      this.getCircleByID(i)
    );
    var [A, B, C] = three;
    [A, B, C].map((excluded) => {
      var [otherOne, otherTwo] = three
        .filter((x) => x.id !== excluded.id)
        .sort((a, b) => a.id - b.id);
      var newTriple = new Triple([otherOne, otherTwo, this.play.circle]);
      const newRadius = this.twoRadii(newTriple).filter(
        (r) =>
          !approxEqual(
            r,
            excluded.id !== 0 ? excluded.radius : -excluded.radius
          )
      )[0];
      pairAndRadiusTwoPossibilities(otherOne, otherTwo, newRadius).map((c) => {
        var newCircle = new Circle(this.nextID(), newRadius, c.x, c.y);
        if (newCircle.isTangentTo(this.play.circle)) {
          var newQuad = new Quad([
            otherOne,
            otherTwo,
            this.play.circle,
            newCircle,
          ]);
          // don't need to add the other quad do the triple
          newTriple.quads = [newQuad];
          this.triples.push(newTriple);
          this.quads.push(newQuad);
          this.circles.push(newCircle);
          newTriple.maxradiusplay = this.getCircleByID(
            newQuad.diffQuadMinusTriple(newTriple)
          ).radius;
        }
        return true;
      });
      return true;
    });
    this.giveNextPlay();
  };

  getCircleByID = (id) => this.circles.filter((c) => c.id === id)[0];

  twoRadii = (triple) => {
    // given triple of MTCs, returns the radii of the two MTCs by Descartes' theorem
    const circleIDs = getCircleIDs(triple.id);
    const radii = circleIDs.map((id) =>
      id !== 0 ? this.getCircleByID(id).radius : -this.getCircleByID(id).radius
    );
    const [a, b, c] = radii;
    return solveDescartes(a, b, c);
  };

  nextID = () => this.circles.length;
}
