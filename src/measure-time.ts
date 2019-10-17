export const runAndMeasureTime = (run) => {
    let t0 = performance.now();

    let returnValue = run();   // <---- The function you're measuring time for

    let t1 = performance.now();

    return {returnValue: returnValue, time: t1 - t0};
};