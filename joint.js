class Joint {

  static offset = { x: 0, y: 0, z: 0};

  get x() { return this._x + Joint.offset.x + ((this._x - (canvasSize.x/2))*Joint.offset.z); }
  get y() { return this._y + Joint.offset.y + ((this._y - (canvasSize.y/2))*Joint.offset.z); }
  set x(value) { this._x = value; }
  set y(value) { this._y = value; }

  constructor(x, y, clr) {
    this._x = x;
    this._y = y;
    this.color = color(clr)
    
    this._z = 0;
    this.diameter = 8;
    this.dragging = false;
  }

  update() {
    if (this.dragging) {
      this._x = mouseX + this.offsetX;
      this._y = mouseY + this.offsetY;
    }
  }

  show() {
    noStroke()
    fill(this.color)
    circle(this.x, this.y, this.diameter);
  }

  pressed() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.diameter) {
      this.dragging = true;
      this.offsetX = this._x - mouseX;
      this.offsetY = this._y - mouseY;
    }
  }

  released() {
    this.dragging = false;
  }

  isOver() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.diameter) {
      return true;
    } else {
      return false;
    }
  }
}