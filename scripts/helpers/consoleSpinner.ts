const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function createSpinner(initialText: string) {
  let frameIndex = 0;
  let currentText = initialText;
  let lastRenderTime = 0;

  const render = () => {
    process.stdout.clearLine(0);
    process.stdout.write(`\r${SPINNER_FRAMES[frameIndex]} ${currentText}`);
    frameIndex = (frameIndex + 1) % SPINNER_FRAMES.length;
    lastRenderTime = Date.now();
  };

  render();

  return {
    update: (text: string) => {
      currentText = text;
      if (Date.now() - lastRenderTime >= 0) {
        render();
      }
    },
    succeed: (text: string) => {
      process.stdout.clearLine(0);
      process.stdout.write(`\r✔ ${text}\n`);
    },
    fail: (text: string) => {
      process.stdout.clearLine(0);
      process.stdout.write(`\r✖ ${text}\n`);
    },
  };
}
