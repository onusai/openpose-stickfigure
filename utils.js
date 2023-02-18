function pose2codestr(pose) {
    for (joint in pose) {
        let j = pose[joint];
        j[0] = j[0];
        j[1] = j[1];
        j.push(jointDef[joint][2]);
        j.push(jointDef[joint][3]);
    }
    console.log(JSON.stringify(pose).replaceAll('],"', '],\n"').replaceAll('{"', '{\n"').replaceAll(']}', ']\n}'));
}

function keyPressed() {
    // press ENTER to export pose to console
    if (keyCode === ENTER) {
        pose2codestr(getPose(true));
    }
}