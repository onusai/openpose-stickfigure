function keyPressed() {
    // press ENTER to export pose to console
    if (keyCode === ENTER) {
        console.log(JSON.stringify(getPose()).replaceAll('],"', '],\n"').replaceAll('{"', '{\n"').replaceAll(']}', ']\n}'));
    }
}