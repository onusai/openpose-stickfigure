class Joint {
  constructor(x, y, clr) {
    this.x = x;
    this.y = y;
    this.color = color(clr)

    this.radius = 10;
    this.dragging = false;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    noStroke()
    fill(this.color)
    circle(this.x, this.y, this.radius);
  }

  pressed() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    this.dragging = false;
  }
}