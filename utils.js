function keyPressed() {
    // press ENTER to export pose to console
    if (keyCode === ENTER) {
        console.log(getPose(false, true, true));
    }
}