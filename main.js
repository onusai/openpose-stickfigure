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

let selectedPose = poses['default'].pose;

// [color, mirrorJoint, mirrorAnchor]
let jointDef = {
  "rWrist": ["#aaff00", "lWrist", "upperChest"],
  "rElbow": ["#ffff00", "lElbow", "upperChest"],
  "rShoulder": [ "#ffaa00", "lShoulder", "upperChest"],
  "rHip": ["#00ffaa", "lHip", "upperChest"],
  "rKnee": ["#00ffff", "lKnee", "upperChest"],
  "rAnkle": ["#00aaff", "lAnkle", "upperChest"],
  "lWrist": ["#00ff55", "rWrist", "upperChest"],
  "lElbow": ["#33ff00", "rElbow", "upperChest"],
  "lShoulder": ["#88ff00", "rShoulder", "upperChest"],
  "lHip": ["#0055ff", "rHip", "upperChest"],
  "lKnee": ["#0000ff", "rKnee", "upperChest"],
  "lAnkle": ["#5500ff", "rAnkle", "upperChest"],
  "upperChest": ["#ff5500", null, null],
  "nose": ["#ff0000", null, null],
  "rHeadInner": ["#aa00ff", "lHeadInner", "nose"],
  "rHeadOuter": ["#ff00aa", "lHeadOuter", "nose"],
  "lHeadInner": ["#ff00ff", "rHeadInner", "nose"],
  "lHeadOuter": ["#ff0055", "rHeadOuter", "nose"]
}

// [jointA, jointB, color]
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
    let jPos = selectedPose[joint];
    joints[joint] = new Joint(jPos[0], jPos[1], j[0]);
    joints[joint].x += canvasSize.x/2;
    joints[joint].y += canvasSize.y/2;
  }

  for (let bone in boneDef) {
    let b = boneDef[bone];
    bones[bone] = new Bone(joints[b[0]], joints[b[1]], b[2]);
  }

  for (let joint in jointDef) {
    if (jointDef[joint][1])
      joints[joint].mirrorJoint = joints[jointDef[joint][1]];
    if (jointDef[joint][2])
      joints[joint].mirrorAnchor = joints[jointDef[joint][2]];
  }

  resetUI();
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

  JointInfoLabel.textContent = "<hover over joint>";
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

function resizeCanv() {
  let pose = getPose();
  canvasSize = {
    x: Math.max(64, document.getElementById("iwidth").value),
    y: Math.max(64, document.getElementById("iheight").value)
  }
  resizeCanvas(canvasSize.x, canvasSize.y);
  resetOffset();
  setPose(pose);
  if (overlayImg) {
    let ratio = Math.min(canvasSize.x / overlayImg.width, canvasSize.y / overlayImg.height);
    overlaySize = { x: overlayImg.width*ratio, y: overlayImg.height*ratio };
  }
}

function resetPose() {
  resetOffset();
  setPose(selectedPose);
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

function getPose() {
  let pose = {};
  for (let jointName in joints) {
      let joint = joints[jointName];
      let dim = { x: canvasSize.x/2, y: canvasSize.y/2};
      pose[jointName] = [round(joint.x-dim.x), round(joint.y-dim.y)];
  }
  return pose;
}

function exportPose() {
  let pose = getPose();
  let out = "";
  let i = 0;
  for (joint in pose) {
    if (i % 2 == 0) out += '\n';
    out += `"${joint}": [${pose[joint][0]}, ${pose[joint][1]}], `;
    i++;
  }
  out = "{" + out.substring(1, out.length-2) + "}";
  let e = document.getElementById("pose-json");
  e.value = out;
  console.log(JSON.stringify(getPose()).replaceAll('],"', '],\n"').replaceAll('{"', '{\n"').replaceAll(']}', ']\n}'));
}

function importPose() {
  let e = document.getElementById("pose-json");
  let pose = JSON.parse(e.value);
  setPose(pose);
  e.value = "";
}

function setPose(pose) {
  let dim = { x: canvasSize.x/2, y: canvasSize.y/2};
  for (joint in pose) {
    joints[joint].x = pose[joint][0] + dim.x;
    joints[joint].y = pose[joint][1] + dim.y;
  }
}

function resetUI() {
  JointInfoLabel = document.getElementById("hover-info");
  offsetSliders.x = document.getElementById("offsetX");
  offsetSliders.y = document.getElementById("offsetY");
  offsetSliders.z = document.getElementById("offsetZ");
  boneWidthSlider = document.getElementById("bone-width");
  jointDiamaterSlider = document.getElementById("joint-diameter");

  offsetSliders.x.min = -canvasSize.x;
  offsetSliders.x.max = canvasSize.x;
  offsetSliders.x.value = 0;
  offsetSliders.y.min = -canvasSize.y;
  offsetSliders.y.max = canvasSize.y;
  offsetSliders.y.value = 0;
  offsetSliders.z.min = -5;
  offsetSliders.z.max = 5;
  offsetSliders.z.value = 0;
  offsetSliders.z.step = 0.1;

  boneWidthSlider.value = 8;
  jointDiamaterSlider.value = 8;

  boneWidthChanged();
  jointDiamaterChanged();

  document.getElementById('radio-ellipse').checked = true;
  setBoneStyle('ellipse');

  let poseSelect = document.getElementById("pose-presets");
  for (pose in poses) {
    let option = document.createElement("option");
    option.value = pose;
    option.text = poses[pose].name;
    poseSelect.add(option);
  }
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

function resetOffset() {
  offsetSliders.x.value = 0;
  offsetSliders.y.value = 0;
  offsetSliders.z.value = 0;
  offsetChanged();
}

function resetBoneJointSize() {
  boneWidthSlider.value = 8;
  jointDiamaterSlider.value = 8;
  boneWidthChanged();
  jointDiamaterChanged();
}

function mirrorJointsChanged(axis) {
  if (axis == "h") {
    let e = document.getElementById("mirror-joints-h");
    Joint.mirrorH = e.checked;
  }
  else if (axis == "v") {
    let e = document.getElementById("mirror-joints-v");
    Joint.mirrorV = e.checked;
  }
}

function poseSelected() {
  let e = document.getElementById("pose-presets");
  selectedPose = poses[e.value].pose;
  resetPose();
}

function flipJoints(axis) {
  let pose = getPose();
  let i = axis == "h" ? 0 : 1;
  for (joint in pose) {
    pose[joint][i] *= -1;
  }
  resetOffset();
  setPose(pose);
}