const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export type ProgressOptions = {
    minimum?: number;
    maximum?: number;
    step?: number | ((value: number) => number);
    interval?: number | false;
    onStart?: () => void;
    onStop?: () => void;
    onChange?: (value: number) => void;
};

function createProgress({
    minimum = 0,
    maximum = 100,
    step = 10,
    interval = 100,
    onStart,
    onStop,
    onChange,
}: ProgressOptions = {}) {
    const progress = {
        value: minimum,
        isActive: false,
        start,
        stop,
        increment,
        set,
    };

    let intervalRef: NodeJS.Timeout;

    function set(val: number) {
        progress.value = clamp(val, minimum, maximum);
        onChange?.(progress.value);
    }
    function start() {
        stop();

        set(minimum);
        progress.isActive = true;

        onStart?.();

        if (interval) intervalRef = setInterval(increment, interval);
    }
    function increment() {
        const increase = step instanceof Function ? step(progress.value) : step;
        set(progress.value + increase);
    }
    function stop() {
        set(100);
        progress.isActive = false;

        onStop?.();

        clearInterval(intervalRef);
    }

    return progress;
}

export { createProgress };
