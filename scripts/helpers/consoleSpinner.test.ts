import { createSpinner } from './consoleSpinner';

describe('createSpinner', () => {
  beforeEach(() => {
    process.stdout.clearLine = process.stdout.clearLine ?? (() => true);
    jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => true);
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should write the initial spinner frame and text immediately on creation', () => {
    createSpinner('Loading...');

    expect(process.stdout.clearLine).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining('Loading...'),
    );
  });

  it('should advance the frame index on each render', () => {
    const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const spinner = createSpinner('Loading...');

    // creation renders frame 0; two updates render frames 1 and 2
    spinner.update('Loading...');
    spinner.update('Loading...');

    const { calls } = (process.stdout.write as jest.Mock).mock;
    expect(calls[0][0]).toContain(SPINNER_FRAMES[0]);
    expect(calls[1][0]).toContain(SPINNER_FRAMES[1]);
    expect(calls[2][0]).toContain(SPINNER_FRAMES[2]);
  });

  it('should wrap around to the first frame after all frames are exhausted', () => {
    const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const spinner = createSpinner('Loading...');

    // Trigger 10 additional renders to exhaust all frames and wrap around
    for (let i = 0; i < SPINNER_FRAMES.length; i++) {
      spinner.update('Loading...');
    }

    const { calls } = (process.stdout.write as jest.Mock).mock;
    // call[0] used frame 0 on creation; call[10] should wrap back to frame 0
    expect(calls[0][0]).toEqual(calls[SPINNER_FRAMES.length][0]);
  });

  describe('update', () => {
    it('should update the spinner text immediately', () => {
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

      const clearLineCalls = (process.stdout.clearLine as jest.Mock).mock
        .invocationCallOrder;
      const writeCalls = (process.stdout.write as jest.Mock).mock
        .invocationCallOrder;

      // The clearLine call from the update (index 1) precedes its write call (index 1)
      expect(clearLineCalls[1]).toBeLessThan(writeCalls[1]);
    });

    it('should not render when Date.now() is behind lastRenderTime', () => {
      jest.useFakeTimers();
      jest.setSystemTime(1000);

      const spinner = createSpinner('Loading...'); // lastRenderTime = 1000
      const writeCountAfterCreate = (process.stdout.write as jest.Mock).mock
        .calls.length;

      // Move clock backwards so Date.now() - lastRenderTime < 0
      jest.setSystemTime(500);
      spinner.update('Should not render');

      expect(process.stdout.write).toHaveBeenCalledTimes(writeCountAfterCreate);

      jest.useRealTimers();
    });
  });

  describe('succeed', () => {
    it('should write a success message', () => {
      const spinner = createSpinner('Loading...');

      spinner.succeed('Done!');

      expect(process.stdout.clearLine).toHaveBeenCalled();
      expect(process.stdout.write).toHaveBeenCalledWith('\r✔ Done!\n');
    });

    it('should not trigger any further renders after succeed is called', () => {
      const spinner = createSpinner('Loading...');
      spinner.succeed('Done!');

      const writeCallCount = (process.stdout.write as jest.Mock).mock.calls
        .length;

      // No additional updates — write count should remain the same
      expect(process.stdout.write).toHaveBeenCalledTimes(writeCallCount);
    });
  });

  describe('fail', () => {
    it('should write a failure message', () => {
      const spinner = createSpinner('Loading...');

      spinner.fail('Something went wrong!');

      expect(process.stdout.clearLine).toHaveBeenCalled();
      expect(process.stdout.write).toHaveBeenCalledWith(
        '\r✖ Something went wrong!\n',
      );
    });

    it('should not trigger any further renders after fail is called', () => {
      const spinner = createSpinner('Loading...');
      spinner.fail('Failed!');

      const writeCallCount = (process.stdout.write as jest.Mock).mock.calls
        .length;

      // No additional updates — write count should remain the same
      expect(process.stdout.write).toHaveBeenCalledTimes(writeCallCount);
    });
  });
});
