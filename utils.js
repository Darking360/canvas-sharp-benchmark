const sharp = require("sharp");
const { loadImage, createCanvas } = require("canvas");
const chalk = require('chalk');
const {
    performance
} = require('perf_hooks');

function getMemoryUsage() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(chalk.blue(`The script uses approximately ${used} MB`));
    console.log(chalk.blue(':: ------------------------ ::'));
}

async function loadWithSharp(path, stress=false) {
    const perfTag = `Sharp-${path}`;
    performance.mark(perfTag + '-init');
    const pipeline = sharp(path);
    // Only stress
    if (stress) {
        pipeline.rotate().resize(200);
    }
    await pipeline.toBuffer();
    performance.mark(perfTag + '-end');
    console.log(chalk.green(`Image ${path} :: Memory consumption`));
    performance.measure(perfTag, perfTag + "-init", perfTag + "-end")
    getMemoryUsage();
}

async function loadWithCanvas(path, width, height, stress=false) {
    const perfTag = `Canvas-${path}`;
    performance.mark(perfTag + '-init');
    const canvasedResult = await loadImage(path, width, height);
    // Only stress
    if (stress) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(canvasedResult, 0, 0, width, height);
        canvas.toDataURL();
    }
    performance.mark(perfTag + '-end');
    console.log(chalk.green(`Image ${path} :: Memory consumption`));
    performance.measure(perfTag, perfTag + "-init", perfTag + "-end")
    getMemoryUsage();
}

module.exports = {
    getMemoryUsage,
    loadWithSharp,
    loadWithCanvas
}