class Bone {
  constructor(jointA, jointB, clr) {
    this.jointA = jointA;
    this.jointB = jointB;
    this.color = color(clr);
  }

  show() {
    stroke(this.color)
    strokeWeight(8)
    line(this.jointA.x, this.jointA.y, this.jointB.x, this.jointB.y);
  }

}