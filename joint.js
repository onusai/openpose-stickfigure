class Joint {

  static offset = { x: 0, y: 0, z: 0};
  static diameter = 8;

  
  static mirrorH = false;
  static mirrorV = false;

  get x() { return this._x + Joint.offset.x + ((this._x - (canvasSize.x/2))*Joint.offset.z); }
  get y() { return this._y + Joint.offset.y + ((this._y - (canvasSize.y/2))*Joint.offset.z); }
  set x(value) { this._x = value; }
  set y(value) { this._y = value; }

  constructor(x, y, clr) {
    this._x = x;
    this._y = y;
    this.color = color(clr)
    
    this._z = 0;
    this.dragging = false;
    this.mirrorJoint = null;
    this.mirrorAnchor = null;
  }

  update() {
    if (this.dragging) {
      this._x = mouseX + this.offsetX;
      this._y = mouseY + this.offsetY;

      if (!this.mirrorJoint) return;

      if (Joint.mirrorH && Joint.mirrorV) {
        this.mirrorJoint._x = this.mirrorAnchor._x-(this._x - this.mirrorAnchor._x);
        this.mirrorJoint._y = this.mirrorAnchor._y-(this._y - this.mirrorAnchor._y);
      }
      else if (Joint.mirrorH) {
        this.mirrorJoint._x = this.mirrorAnchor._x-(this._x - this.mirrorAnchor._x);
        this.mirrorJoint._y = this._y;
      }
      else if (Joint.mirrorV) {
        this.mirrorJoint._y = this.mirrorAnchor._y-(this._y - this.mirrorAnchor._y);
        this.mirrorJoint._x = this._x;
      }
    }
  }

  show() {
    noStroke()
    fill(this.color)
    circle(this.x, this.y, Joint.diameter);
  }

  pressed() {
    if (dist(mouseX, mouseY, this.x, this.y) < Joint.diameter) {
      this.dragging = true;
      this.offsetX = this._x - mouseX;
      this.offsetY = this._y - mouseY;
    }
  }

  released() {
    this.dragging = false;
  }

  isOver() {
    if (dist(mouseX, mouseY, this.x, this.y) < Joint.diameter) {
      return true;
    } else {
      return false;
    }
  }
}