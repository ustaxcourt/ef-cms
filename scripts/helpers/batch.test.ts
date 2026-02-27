import { runInBatches } from './batch';
import { sleep } from '@shared/tools/helpers';

jest.mock('@shared/tools/helpers', () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}));

describe('Batch Processing', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('runs all tasks in batches', async () => {
    const tasks = [
      jest.fn().mockResolvedValue(1),
      jest.fn().mockResolvedValue(2),
      jest.fn().mockResolvedValue(3),
      jest.fn().mockResolvedValue(4),
      jest.fn().mockResolvedValue(5),
    ];

    await runInBatches(tasks, 2, 100);

    expect(tasks[0]).toHaveBeenCalled();
    expect(tasks[1]).toHaveBeenCalled();
    expect(tasks[2]).toHaveBeenCalled();
    expect(tasks[3]).toHaveBeenCalled();
    expect(tasks[4]).toHaveBeenCalled();

    expect(consoleLogSpy).toHaveBeenCalledWith('running batch:', [0, 1]);
    expect(consoleLogSpy).toHaveBeenCalledWith('running batch:', [2, 3]);
    expect(consoleLogSpy).toHaveBeenCalledWith('running batch:', [4]);

    expect(sleep).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledWith(100);
  });

  it('continues running on error if breakOnError is false', async () => {
    const tasks = [
      jest.fn().mockResolvedValue(1),
      jest.fn().mockRejectedValue(new Error('Batch Error')),
      jest.fn().mockResolvedValue(3),
    ];

    await runInBatches(tasks, 1, 0, false);

    expect(tasks[0]).toHaveBeenCalled();
    expect(tasks[1]).toHaveBeenCalled();
    expect(tasks[2]).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in batch:',
      expect.any(Error),
    );
  });

  it('throws on error if breakOnError is true', async () => {
    const tasks = [
      jest.fn().mockResolvedValue(1),
      jest.fn().mockRejectedValue(new Error('Batch Error')),
      jest.fn().mockResolvedValue(3),
    ];

    await expect(runInBatches(tasks, 1, 0, true)).rejects.toThrow(
      'Batch Error',
    );

    expect(tasks[0]).toHaveBeenCalled();
    expect(tasks[1]).toHaveBeenCalled();
    expect(tasks[2]).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in batch:',
      expect.any(Error),
    );
  });

  it('does not sleep if rest is 0', async () => {
    const tasks = [jest.fn().mockResolvedValue(1)];
    await runInBatches(tasks, 1, 0);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('does not sleep if rest is negative', async () => {
    const tasks = [jest.fn().mockResolvedValue(1)];
    await runInBatches(tasks, 1, -1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('uses default values for concurrency and rest if no values are provided', async () => {
    const tasks = [jest.fn().mockResolvedValue(1)];
    await runInBatches(tasks);
    expect(sleep).toHaveBeenCalledWith(1000);
  });
});
