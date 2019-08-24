const fs = require("fs");
const { loadWithSharp, loadWithCanvas } = require("./utils");
const {
    PerformanceObserver
} = require('perf_hooks');

const imagesPath = "./images";

fs.readdir(imagesPath, async (err, results) => {
    if (err) {
        console.log('Error ---->');
        console.log(err);
        return;
    }

    // Order files in directory increasing
    const ordered = results.sort((a,b) => {
        const [widthA] = a.split('x');
        const [widthB] = b.split('x');
        return Number(widthA) - Number(widthB);
    });

    // Activate the observer
    const obs = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0]
        console.log(`Time for ('${entry.name}')`, entry.duration);
    });
    obs.observe({ entryTypes: ['measure'], buffered: false});

    console.log(':: ---- Sharp ---- ::');
    // Load images Sharp
    const sharpArrayOfPromises = ordered.map(async (result) => {
        const [width, height] = result.replace(/\.jpg/gi, '').split('x');
        return loadWithSharp(`${imagesPath}/${result}`, Number(width), Number(height));
    })

    const sharpResults = await Promise.all(sharpArrayOfPromises);

    console.log(':: ---- ---- ---- ::');
    console.log(':: ---- Canvas ---- ::');
    // Load images Canvas
    const canvasArrayOfPromises = ordered.map(async (result) => {
        const [width, height] = result.replace(/\.jpg/gi, '').split('x');
        return loadWithCanvas(`${imagesPath}/${result}`, Number(width), Number(height));
    });
    
    const canvasResults = await Promise.all(canvasArrayOfPromises);
    console.log(':: ---- ---- ---- ::');
});