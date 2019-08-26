const fs = require("fs");
const { loadWithSharp, loadWithCanvas } = require("./utils");
const yargs = require('yargs');
const {
    PerformanceObserver
} = require('perf_hooks');

const imagesPath = "./images";

const { cascade, stress } = yargs
    .option('parallel', {
        alias: 'p',
        describe: 'run the script in parallel, this is default behavior'
    })
    .option('cascade', {
        alias: 'c',
        describe: 'run the script in casacade, one after the other to measure individual performance on each image'
    })
    .option('stress', {
        alias: 's',
        describe: 'run the script with more tasks for each sharp and canvas, like creating a canvas and loading the image, or rotate the image and resize it'
    })
    .help()
    .argv;

async function processArrayWith(resultsArray, processFunction) {
    for (const result in resultsArray) {
        const [width, height] = resultsArray[result].replace(/\.jpg/gi, '').split('x');
        await processFunction(`${imagesPath}/${resultsArray[result]}`, Number(width), Number(height), stress)
    }
}

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

    if (cascade) {
        console.log(':: ---- Sharp ---- ::');
        await processArrayWith(ordered, loadWithSharp);
        console.log(':: --------------- ::');

        console.log(':: ---- Canvas ---- ::');
        await processArrayWith(ordered, loadWithCanvas);
        console.log(':: --------------- ::');
    } else {
        console.log(':: ---- Sharp ---- ::');
        // Load images Sharp
        const sharpArrayOfPromises = ordered.map(async (result) => {
            const [width, height] = result.replace(/\.jpg/gi, '').split('x');
            return loadWithSharp(`${imagesPath}/${result}`, Number(width), Number(height), stress);
        })

        const sharpResults = await Promise.all(sharpArrayOfPromises);

        console.log(':: ---- ---- ---- ::');
        console.log(':: ---- Canvas ---- ::');
        // Load images Canvas
        const canvasArrayOfPromises = ordered.map(async (result) => {
            const [width, height] = result.replace(/\.jpg/gi, '').split('x');
            return loadWithCanvas(`${imagesPath}/${result}`, Number(width), Number(height), stress);
        });
        
        const canvasResults = await Promise.all(canvasArrayOfPromises);
        console.log(':: ---- ---- ---- ::');
    }

});