let canvasSize;

let overlayImg;
let overlaySize;
let overlayEnabled = false;

let bones = {};
let joints = {};

let JointInfoLabel;
let offsetSliders = {};
let boneWidthSlider;
let jointDiamaterSlider;

let jointDef = {
  "rWrist": [-191, -100, "#aaff00"],
  "rElbow": [-110, -88, "#ffff00"],
  "rShoulder": [-51, -126, "#ffaa00"],
  "rHip": [-50, 8, "#00ffaa"],
  "rKnee": [-40, 113, "#00ffff"],
  "rAnkle": [-42, 239, "#00aaff"],
  "lWrist": [139, -25, "#00ff55"],
  "lElbow": [66, -60, "#33ff00"],
  "lShoulder": [22, -126, "#88ff00"],
  "lHip": [16, 9, "#0055ff"],
  "lKnee": [8, 118, "#0000ff"],
  "lAnkle": [57, 215, "#5500ff"],
  "upperChest": [-15, -130, "#ff5500"],
  "nose": [-10, -168, "#ff0000"],
  "rHeadInner": [-21, -191, "#aa00ff"],
  "rHeadOuter": [-41, -183, "#ff00aa"],
  "lHeadInner": [4, -189, "#ff00ff"],
  "lHeadOuter": [24, -181, "#ff0055"]
  }

let boneDef = {
  "rWrist": ["rWrist", "rElbow", "#999900"],
  "rElbow": ["rElbow", "rShoulder", "#996600"],
  "rShoulder": ["rShoulder", "upperChest", "#990000"],
  "rHip": ["rHip", "upperChest", "#009900"],
  "rKnee": ["rKnee", "rHip", "#009933"],
  "rAnkle": ["rAnkle", "rKnee", "#009966"],
  "lWrist": ["lWrist", "lElbow", "#339900"],
  "lElbow": ["lElbow", "lShoulder", "#669900"],
  "lShoulder": ["lShoulder", "upperChest", "#993300"],
  "lHip": ["lHip", "upperChest", "#009999"],
  "lKnee": ["lKnee", "lHip", "#006699"],
  "lAnkle": ["lAnkle", "lKnee", "#003399"],
  "upperChest": ["upperChest", "nose", "#000099"],
  "rHeadInner": ["rHeadInner", "nose", "#330099"],
  "rHeadOuter": ["rHeadOuter", "rHeadInner", "#660099"],
  "lHeadInner": ["lHeadInner", "nose", "#990099"],
  "lHeadOuter": ["lHeadOuter", "lHeadInner", "#990066"]
}

function setup() {
  canvasSize = {
    x: document.getElementById("iwidth").value,
    y: document.getElementById("iheight").value
  }

  createCanvas(canvasSize.x, canvasSize.y);

  Joint.offset = {x: 0, y: 0, z: 0};

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

  JointInfoLabel = document.getElementById("hover-info");
  offsetSliders.x = document.getElementById("offsetX");
  offsetSliders.y = document.getElementById("offsetY");
  offsetSliders.z = document.getElementById("offsetZ");
  boneWidthSlider = document.getElementById("bone-width");
  jointDiamaterSlider = document.getElementById("joint-diameter");

  offsetSliders.x .min = -canvasSize.x;
  offsetSliders.x .max = canvasSize.x;
  offsetSliders.x .value = 0;
  offsetSliders.y.min = -canvasSize.y;
  offsetSliders.y.max = canvasSize.y;
  offsetSliders.y.value = 0;
  offsetSliders.z.min = -5;
  offsetSliders.z.max = 5;
  offsetSliders.z.value = 0;
  offsetSliders.z.step = 0.1;
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

  JointInfoLabel.textContent = "";
  for (let joint in joints) {
    let j = joints[joint];
    j.update();
    j.show();
    if (j.isOver()) {
      JointInfoLabel.textContent = joint;
    }
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

function getPose(color=false, newline=false) {
  let lines = ['{'];
  for (let jointName in joints) {
      let joint = joints[jointName];
      let dim = { x: canvasSize.x/2, y: canvasSize.y/2};
      if (color)
        lines.push(`"${jointName}": [${joint.x-dim.x}, ${joint.y-dim.y}, "${jointDef[jointName][2]}"],`);
      else
        lines.push(`"${jointName}": [${joint.x-dim.x}, ${joint.y-dim.y}],`);
  }
  lines.push('}');
  let out = newline ? lines.join('\n') : lines.join(' ');
  out = out.replace(/,([^,]*)$/, '$1'); // remove last comma to get valid json
  return out;
}

function exportPose() {
  let e = document.getElementById("pose-json");
  e.value = getPose(false);
}

function importPose() {
  let e = document.getElementById("pose-json");
  let pose = JSON.parse(e.value);
  let dim = { x: canvasSize.x/2, y: canvasSize.y/2};
  for (joint in pose) {
    joints[joint].x = pose[joint][0] + dim.x;
    joints[joint].y = pose[joint][1] + dim.y;
  }
  e.value = "";
}

function offsetChanged() {
  Joint.offset.x = offsetSliders.x.value*1;
  Joint.offset.y = offsetSliders.y.value*-1;
  Joint.offset.z = offsetSliders.z.value*1;
}

function setBoneStyle(value) {
  Bone.style = value;
}

function boneWidthChanged() {
  Bone.width = boneWidthSlider.value*1;
}

function jointDiamaterChanged() {
  Joint.diameter = jointDiamaterSlider.value*1;
}
