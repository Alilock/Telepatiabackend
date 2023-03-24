
const fs = require('fs');
const path = require('path');

const fileSave = (image) => {
    let paths = [];
    let ext = path.extname(image.name);
    let newName = `${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
    let newPath = path.join(__dirname, './assets/uploads', newName);
    image.mv(newPath, err => {
        console.log('err', err);
    })
    paths.push(newName);

    return paths;
}
module.exports = {
    fileSave: fileSave
}