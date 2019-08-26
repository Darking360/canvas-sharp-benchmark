# Node Canvas vs Sharp - Benchmarks

This repository is only a test to check the overall behavior of this libraries, it loads some images from 400px up to 3800px in width to check how much memory and time does it take for both to process them, it includes flags to run the tests in cascade to see the behavior in a one by one process pipeline, but, the default tests are in parallel since this is a more real-world use case.

## Install

As simple as:

```
yarn install
```

🚀

## Running the test

As mentioned before you can run the tests in parallel or in cascade, so for running in parallel ou can run:

```
node index.js
```

To run it in cascade:

```
node index.js -c

or

node index-js --cascade
```

And you can run both programs with some `stress` in them, this is adding some pipeline operations for `sharp` and using some canvas creations for `node canvas`, you can run it like:

```
node index.js -s

or in cascade with stress

node index.js -c -s
```

And that's it 🔥