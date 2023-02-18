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

    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex;// + a;

    return hex;
}
  
// export pose to console
function keyPressed() {
if (keyCode === ENTER) {
    for (let jointName in joints) {
    let joint = joints[jointName];
    let dim = { x: canvasSize.x/2, y: canvasSize.y/2};
    //format: "lowerArmR": new Joint(1, 1, "#aaff00"),
    console.log(`"${jointName}": new Joint(${joint.x-dim.x}, ${joint.y-dim.y}, "#${rgba2hex(joint.color.toString())}"),`)
    }
}
}