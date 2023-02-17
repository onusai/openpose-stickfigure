class Joint {
    constructor(x, y, clr) {
  
      this.dragging = false; // Is the object being dragged?
      this.rollover = false; // Is the mouse over the ellipse?
  
      this.x = x//*40;
      this.y = y//*40;
      this.radius = 10;
      this.color = color(clr)
    }
  
    over() {
      // Is mouse over object
      if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
        this.rollover = true;
      } else {
        this.rollover = false;
      }
  
    }
  
    update() {
      // Adjust location if being dragged
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
      // Did I click on the rectangle?
      if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
        this.dragging = true;
        // If so, keep track of relative location of click to corner of rectangle
        this.offsetX = this.x - mouseX;
        this.offsetY = this.y - mouseY;
      }
    }
  
    released() {
      // Quit dragging
      this.dragging = false;
    }
  }