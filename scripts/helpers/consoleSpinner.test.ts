import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { createSpinner } from './consoleSpinner';

jest.mock('@shared/business/utilities/DateHandler', () => ({
  getCurrentDateTimeInMillis: jest.fn().mockReturnValue(1000),
}));

describe('createSpinner', () => {
  beforeEach(() => {
    // Each call returns a value 100ms ahead of the previous, so the throttle
    // condition (now - lastRenderTime >= 100) always passes for updates.
    let clock = 0;
    (getCurrentDateTimeInMillis as jest.Mock).mockImplementation(() => {
      clock += 100;
      return clock;
    });
    process.stdout.clearLine = process.stdout.clearLine ?? (() => true);
    jest.spyOn(process.stdout, 'clearLine').mockImplementation(() => true);
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should render periodically using setInterval', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    const spinner = createSpinner('Loading...');

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 80);

    const initialWriteCount = (process.stdout.write as jest.Mock).mock.calls
      .length;

    jest.advanceTimersByTime(80);

    expect(process.stdout.write).toHaveBeenCalledTimes(initialWriteCount + 1);

    spinner.succeed('Done');
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

    it('should not render when getCurrentDateTimeInMillis() is behind lastRenderTime', () => {
      // Override to: creation returns 100 (lastRenderTime=100), update returns 150 → 150-100=50 < 100
      let callCount = 0;
      (getCurrentDateTimeInMillis as jest.Mock).mockImplementation(() => {
        callCount += 1;
        return callCount === 1 ? 100 : 150;
      });

      const spinner = createSpinner('Loading...');
      const writeCountAfterCreate = (process.stdout.write as jest.Mock).mock
        .calls.length;

      spinner.update('Should not render');

      expect(process.stdout.write).toHaveBeenCalledTimes(writeCountAfterCreate);
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
