const sharp = require("sharp");
const { loadImage } = require("canvas");
const {
    performance
} = require('perf_hooks');

function getMemoryUsage() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${used} MB`);
    console.log(':: ------------------------ ::');
}

async function loadWithSharp(path) {
    const perfTag = `Sharp-${path}`;
    performance.mark(perfTag + '-init');
    const sharppedResult = await sharp(path).toBuffer();
    performance.mark(perfTag + '-end');
    console.log(`Image ${path} :: Memory consumption`);
    performance.measure(perfTag, perfTag + "-init", perfTag + "-end")
    getMemoryUsage();
}

async function loadWithCanvas(path,) {
    const perfTag = `Canvas-${path}`;
    performance.mark(perfTag + '-init');
    const canvasedResult = await loadImage(path);
    performance.mark(perfTag + '-end');
    console.log(`Image ${path} :: Memory consumption`);
    performance.measure(perfTag, perfTag + "-init", perfTag + "-end")
    getMemoryUsage();
}

module.exports = {
    getMemoryUsage,
    loadWithSharp,
    loadWithCanvas
}