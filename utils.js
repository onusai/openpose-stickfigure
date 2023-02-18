// press ENTER to export pose to console
function keyPressed() {
    if (keyCode === ENTER) {
        let lines = ['{'];
        for (let jointName in joints) {
            let joint = joints[jointName];
            let dim = { x: canvasSize.x/2, y: canvasSize.y/2};
            lines.push(`"${jointName}": [${joint.x-dim.x}, ${joint.y-dim.y}, "${jointDef[jointName][2]}"],`);
        }
        lines.push('}');
        let out = lines.join('\n');
        out = out.replace(/,([^,]*)$/, '$1'); // remove last comma to get valid json
        console.log(out);
    }
}