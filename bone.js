const midpoint = (p1, p2) => [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];

class Bone {

  static style = "ellipse";
  static width = 8;

  constructor(jointA, jointB, clr) {
    this.jointA = jointA;
    this.jointB = jointB;
    this.color = color(clr);
  }

  show() {
    if (Bone.style == "ellipse") {
      let pos = midpoint(this.jointA, this.jointB);
      let len = dist(this.jointA.x, this.jointA.y, this.jointB.x, this.jointB.y);
      let a = atan2(this.jointB.y - this.jointA.y, this.jointB.x - this.jointA.x);
  
      push();
      noStroke();
      fill(this.color);
      translate(pos[0], pos[1]);
      rotate(a);
      ellipse(0, 0, len, Bone.width);
      pop();
    }
    else if (Bone.style == "line") {
      stroke(this.color)
      strokeWeight(Bone.width)
      line(this.jointA.x, this.jointA.y, this.jointB.x, this.jointB.y);
    }
  }
}