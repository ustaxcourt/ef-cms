import { createSpinner } from './consoleSpinner';

describe('createSpinner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => true);
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should write the initial spinner frame and text after the first tick', () => {
    createSpinner('Loading...');

    jest.advanceTimersByTime(80);

    expect(process.stdout.clearLine).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining('Loading...'),
    );
  });

  it('should cycle through spinner frames on each tick', () => {
    createSpinner('Loading...');

    jest.advanceTimersByTime(80 * 3);

    expect(process.stdout.write).toHaveBeenCalledTimes(3);
  });

  it('should wrap around spinner frames after all frames are exhausted', () => {
    const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    createSpinner('Loading...');

    // Advance past all 10 frames
    jest.advanceTimersByTime(80 * (SPINNER_FRAMES.length + 1));

    const firstCall = (process.stdout.write as jest.Mock).mock.calls[0][0];
    const wrappedCall = (process.stdout.write as jest.Mock).mock.calls[
      SPINNER_FRAMES.length
    ][0];

    expect(firstCall).toEqual(wrappedCall);
  });

  describe('update', () => {
    it('should update the spinner text', () => {
      const spinner = createSpinner('Loading...');

      spinner.update('Still loading...');

      expect(process.stdout.clearLine).toHaveBeenCalled();
      expect(process.stdout.write).toHaveBeenCalledWith(
        expect.stringContaining('Still loading...'),
      );
    });

    it('should clear the line before writing the updated text', () => {
      const spinner = createSpinner('Loading...');

      spinner.update('Updated text');

      const clearLineOrder = (process.stdout.clearLine as jest.Mock).mock
        .invocationCallOrder[0];
      const writeOrder = (process.stdout.write as jest.Mock).mock
        .invocationCallOrder[0];

      expect(clearLineOrder).toBeLessThan(writeOrder);
    });
  });

  describe('succeed', () => {
    it('should stop the spinner and write a success message', () => {
      const spinner = createSpinner('Loading...');

      spinner.succeed('Done!');

      expect(process.stdout.clearLine).toHaveBeenCalled();
      expect(process.stdout.write).toHaveBeenCalledWith('\r✔ Done!\n');
    });

    it('should stop the interval after succeed is called', () => {
      const spinner = createSpinner('Loading...');
      spinner.succeed('Done!');

      const writeCallCount = (process.stdout.write as jest.Mock).mock.calls
        .length;

      // Advance timers — no more writes should happen
      jest.advanceTimersByTime(800);

      expect(process.stdout.write).toHaveBeenCalledTimes(writeCallCount);
    });
  });

  describe('fail', () => {
    it('should stop the spinner and write a failure message', () => {
      const spinner = createSpinner('Loading...');

      spinner.fail('Something went wrong!');

      expect(process.stdout.clearLine).toHaveBeenCalled();
      expect(process.stdout.write).toHaveBeenCalledWith(
        '\r✖ Something went wrong!\n',
      );
    });

    it('should stop the interval after fail is called', () => {
      const spinner = createSpinner('Loading...');
      spinner.fail('Failed!');

      const writeCallCount = (process.stdout.write as jest.Mock).mock.calls
        .length;

      // Advance timers — no more writes should happen
      jest.advanceTimersByTime(800);

      expect(process.stdout.write).toHaveBeenCalledTimes(writeCallCount);
    });
  });
});
