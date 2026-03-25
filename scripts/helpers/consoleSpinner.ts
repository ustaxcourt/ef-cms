import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function createSpinner(initialText: string) {
  let frameIndex = 0;
  let currentText = initialText;
  let lastRenderTime = 0;

  const render = () => {
    process.stdout.clearLine(0);
    process.stdout.write(`\r${SPINNER_FRAMES[frameIndex]} ${currentText}`);
    frameIndex = (frameIndex + 1) % SPINNER_FRAMES.length;
    lastRenderTime = getCurrentDateTimeInMillis();
  };

  const interval = setInterval(() => {
    render();
  }, 80);

  render();

  return {
    update: (text: string) => {
      currentText = text;
      const now = getCurrentDateTimeInMillis();
      if (now - lastRenderTime >= 100) {
        lastRenderTime = now;
        render();
      }
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
