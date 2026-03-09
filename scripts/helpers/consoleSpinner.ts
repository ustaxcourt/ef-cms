const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function createSpinner(initialText: string) {
  let frameIndex = 0;
  let currentText = initialText;

  const interval = setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.write(`\r${SPINNER_FRAMES[frameIndex]} ${currentText}`);
    frameIndex = (frameIndex + 1) % SPINNER_FRAMES.length;
  }, 80);

  return {
    update: (text: string) => {
      currentText = text; // only update the text, let the interval handle rendering
      process.stdout.clearLine(0);
      process.stdout.write(`\r${SPINNER_FRAMES[frameIndex]} ${currentText}`);
    },
    succeed: (text: string) => {
      clearInterval(interval);
      process.stdout.clearLine(0);
      process.stdout.write(`\r✔ ${text}\n`);
    },
    fail: (text: string) => {
      clearInterval(interval);
      process.stdout.clearLine(0);
      process.stdout.write(`\r✖ ${text}\n`);
    },
  };
}
