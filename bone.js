const midpoint = (p1, p2) => [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];

class Bone {

  static style = "ellipse";

  constructor(jointA, jointB, clr) {
    this.jointA = jointA;
    this.jointB = jointB;
    this.color = color(clr);

    this.width = 8;
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
      ellipse(0, 0, len, this.width);
      pop();
    }
    else if (Bone.style == "line") {
      stroke(this.color)
      strokeWeight(8)
      line(this.jointA.x, this.jointA.y, this.jointB.x, this.jointB.y);
    }
  }
}