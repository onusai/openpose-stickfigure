let canvasSize;

let overlayImg;
let overlaySize;
let overlayEnabled = false;

let bones = {};
let joints = {};

let jointDef = {
  "lowerArmR": [-191, -100, "#aaff00"],
  "upperArmR": [-110, -88, "#ffff00"],
  "shoulderR": [-51, -126, "#ffaa00"],
  "rSide": [-50, 8, "#00ffaa"],
  "upperRLeg": [-40, 113, "#00ffff"],
  "lowerRLeg": [-42, 239, "#00aaff"],
  "lowerArmL": [139, -25, "#00ff55"],
  "upperArmL": [66, -60, "#33ff00"],
  "shoulderL": [22, -126, "#88ff00"],
  "LSide": [16, 9, "#0055ff"],
  "upperLegL": [8, 118, "#0000ff"],
  "lowerLegL": [57, 215, "#5500ff"],
  "neck": [-15, -130.33333333333334, "#ff5500"],
  "head": [-10, -168, "#ff0000"],
  "headRSideInner": [-21, -191, "#aa00ff"],
  "headRSideOuter": [-41, -183, "#ff00aa"],
  "headLSideInner": [4, -189, "#ff00ff"],
  "headLSideOuter": [24, -181, "#ff0055"]
  }

let boneDef = {
  "lowerArmR": ["lowerArmR", "upperArmR", "#999900"],
  "upperArmR": ["upperArmR", "shoulderR", "#996600"],
  "shoulderR": ["shoulderR", "neck", "#990000"],
  "rSide": ["rSide", "neck", "#009900"],
  "upperRLeg": ["upperRLeg", "rSide", "#009933"],
  "lowerRLeg": ["lowerRLeg", "upperRLeg", "#009966"],
  "lowerArmL": ["lowerArmL", "upperArmL", "#339900"],
  "upperArmL": ["upperArmL", "shoulderL", "#669900"],
  "shoulderL": ["shoulderL", "neck", "#993300"],
  "LSide": ["LSide", "neck", "#009999"],
  "upperLegL": ["upperLegL", "LSide", "#006699"],
  "lowerLegL": ["lowerLegL", "upperLegL", "#003399"],
  "neck": ["neck", "head", "#000099"],
  "headRSideInner": ["headRSideInner", "head", "#330099"],
  "headRSideOuter": ["headRSideOuter", "headRSideInner", "#660099"],
  "headLSideInner": ["headLSideInner", "head", "#990099"],
  "headLSideOuter": ["headLSideOuter", "headLSideInner", "#990066"]
}

function setup() {
  canvasSize = {
    x: document.getElementById("iwidth").value,
    y: document.getElementById("iheight").value
  }

  createCanvas(canvasSize.x, canvasSize.y);
  
  for (let joint in jointDef) {
    let j = jointDef[joint];
    joints[joint] = new Joint(j[0], j[1], j[2]);
    joints[joint].x += canvasSize.x/2;
    joints[joint].y += canvasSize.y/2;
  }

  for (let bone in boneDef) {
    let b = boneDef[bone];
    bones[bone] = new Bone(joints[b[0]], joints[b[1]], b[2]);
  }
}

function draw() {
  background(0);
  
  if (overlayImg && overlayEnabled) {
    let x = (canvasSize.x - overlaySize.x) / 2;
    let y = (canvasSize.y - overlaySize.y) / 2;
    tint(255, 127);
    image(overlayImg, x, y, overlaySize.x, overlaySize.y);
  }

  for (let bone in bones) {
    bones[bone].show();
  }

  for (let joint in joints) {
    joints[joint].update();
    joints[joint].show();
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
  reader.onload = function() {
    overlayImg = loadImage(reader.result);
    overlayEnabled = false;
    setTimeout(() => {
      let ratio = Math.min(canvasSize.x / overlayImg.width, canvasSize.y / overlayImg.height);
      overlaySize = { x: overlayImg.width*ratio, y: overlayImg.height*ratio };
      overlayEnabled = true;
    }, "500")
  }
  reader.readAsDataURL(event.target.files[0]);
}

function toggleOverlay() {
  overlayEnabled = !overlayEnabled;
}