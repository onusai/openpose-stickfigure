let canvasSize = { x: 512, y: 512}
let overlaySize;
let overlayImg;
let enableOverlay = false;

let joints;
let bones;

function reloadApp() {
  let width = document.getElementById("iwidth").value;
  let height = document.getElementById("iheight").value;
  canvasSize = {x: width, y: height}
  setup()
}

function setup() {
  createCanvas(canvasSize.x, canvasSize.y);
  
  joints = {
    "lowerArmR": new Joint(-145, 18, "#aaff00"), 
    "upperArmR": new Joint(-117, -50, "#ffff00"), 
    "shoulderR": new Joint(-37, -86, "#ffaa00"), 
    "rSide": new Joint(-20, 57, "#00ffaa"), 
    "upperRLeg": new Joint(-6, 149, "#00ffff"), 
    "lowerRLeg": new Joint(-36, 236, "#00aaff"), 
    "lowerArmL": new Joint(177, -170, "#00ff55"), 
    "upperArmL": new Joint(125, -102, "#33ff00"), 
    "shoulderL": new Joint(39, -82, "#88ff00"), 
    "LSide": new Joint(32, 62, "#0055ff"), 
    "upperLegL": new Joint(83, 149, "#0000ff"), 
    "lowerLegL": new Joint(67, 236, "#5500ff"), 
    "neck": new Joint(0, -85.33333333333334, "#ff5500"), 
    "head": new Joint(5, -147, "#ff0000"), 
    "headRSideInner": new Joint(-14, -165, "#aa00ff"), 
    "headRSideOuter": new Joint(-30, -155, "#ff00aa"), 
    "headLSideInner": new Joint(24, -159, "#ff00ff"), 
    "headLSideOuter": new Joint(40, -141, "#ff0055")
  }
  
  for (joint in joints) {
    joints[joint].x += canvasSize.x/2
    joints[joint].y += canvasSize.y/2
  }
  
  bones = {
    "lowerArmR": new Bone(joints.lowerArmR, joints.upperArmR, "#999900"),
    "upperArmR": new Bone(joints.upperArmR, joints.shoulderR, "#996600"),
    "shoulderR": new Bone(joints.shoulderR, joints.neck, "#990000"),
    "rSide": new Bone(joints.rSide, joints.neck, "#009900"),
    "upperRLeg": new Bone(joints.upperRLeg, joints.rSide, "#009933"),
    "lowerRLeg": new Bone(joints.lowerRLeg, joints.upperRLeg, "#009966"),
    "lowerArmL": new Bone(joints.lowerArmL, joints.upperArmL, "#339900"),
    "upperArmL": new Bone(joints.upperArmL, joints.shoulderL, "#669900"),
    "shoulderL": new Bone(joints.shoulderL, joints.neck, "#993300"),
    "LSide": new Bone(joints.LSide, joints.neck, "#009999"),
    "upperLegL": new Bone(joints.upperLegL, joints.LSide, "#006699"),
    "lowerLegL": new Bone(joints.lowerLegL, joints.upperLegL, "#003399"),
    "neck": new Bone(joints.neck, joints.head, "#000099"),
    "headRSideInner": new Bone(joints.headRSideInner, joints.head, "#330099"),
    "headRSideOuter": new Bone(joints.headRSideOuter, joints.headRSideInner, "#660099"),
    "headLSideInner": new Bone(joints.headLSideInner, joints.head, "#990099"),
    "headLSideOuter": new Bone(joints.headLSideOuter, joints.headLSideInner, "#990066")
  }
}

function draw() {
  background(0);
  
  if (overlayImg && enableOverlay) {
    let x = (canvasSize.x - overlaySize.x) / 2;
    let y = (canvasSize.y - overlaySize.y) / 2;
    tint(255, 127);
    image(overlayImg, x, y, overlaySize.x, overlaySize.y);
  }
  tint(255);
  for (let bone in bones) bones[bone].show();
  for (let joint in joints) {
    joint = joints[joint];
    joint.update();
    joint.over();
    joint.show();
  }
}

function mousePressed() {
  for (let joint in joints) {
    joints[joint].pressed();
  }
}

function mouseReleased() {
  for (let joint in joints) {
    joints[joint].released();
  }
}

function loadOverlay(event) {
  let reader = new FileReader();
  reader.onload = function(){
    overlayImg = loadImage(reader.result);
    
    enableOverlay = false;
    setTimeout(() => {
      let overlay = new Image();
      overlay.src = reader.result;
      document.getElementById("hidden").appendChild(overlay);
      let ratio = Math.min(canvasSize.x / overlay.width, canvasSize.y / overlay.height);
      overlaySize = { x: overlay.width*ratio, y: overlay.height*ratio };
      enableOverlay = true;
    }, "500")
    
  }
  reader.readAsDataURL(event.target.files[0]);
}

function toggleOverlay() {
  enableOverlay = !enableOverlay;
}

function rgba2hex(orig) {
  var a, isPercent,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = (rgb && rgb[4] || "").trim(),
    hex = rgb ?
    (rgb[1] | 1 << 8).toString(16).slice(1) +
    (rgb[2] | 1 << 8).toString(16).slice(1) +
    (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

  if (alpha !== "") {
    a = alpha;
  } else {
    a = 01;
  }
  // multiply before convert to HEX
  a = ((a * 255) | 1 << 8).toString(16).slice(1)
  hex = hex;// + a;

  return hex;
}

// export pose to console
function keyPressed() {
  if (keyCode === ENTER) {
    for (let jointName in joints) {
      let joint = joints[jointName];
      let dim = 512/2
      //"lowerArmR": new Joint(1, 1, "#aaff00"),
      console.log(`"${jointName}": new Joint(${joint.x-dim}, ${joint.y-dim}, "#${rgba2hex(joint.color.toString())}"),`)
    }
  }
}