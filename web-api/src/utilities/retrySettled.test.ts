import { retrySettled } from './retrySettled';

jest.mock('@web-api/utilities/logger/getDawsonLogger', () => ({
  getDawsonLogger: () => ({
    error: jest.fn(),
  }),
}));

describe('retrySettled', () => {
  it('resolves with results in input order when all succeed on first attempt', async () => {
    const results = await retrySettled([1, 2, 3], n => Promise.resolve(n * 2));
    expect(results).toEqual([2, 4, 6]);
  });

  it('retries only the items that failed', async () => {
    const callCounts = new Map<number, number>();

    const results = await retrySettled([1, 2, 3], n => {
      callCounts.set(n, (callCounts.get(n) ?? 0) + 1);
      if (n === 2 && callCounts.get(n) === 1) {
        return Promise.reject(new Error('fail-once'));
      }
      return Promise.resolve(n * 10);
    });

    expect(results).toEqual([10, 20, 30]);
    expect(callCounts.get(1)).toBe(1);
    expect(callCounts.get(2)).toBe(2);
    expect(callCounts.get(3)).toBe(1);
  });

  it('throws the last error when an item still fails after maxAttempts', async () => {
    const attempts = { 1: 0 };
    await expect(
      retrySettled(
        [1],
        () => {
          attempts[1]++;
          return Promise.reject(new Error(`fail-${attempts[1]}`));
        },
        { maxAttempts: 3 },
      ),
    ).rejects.toThrow('fail-3');
    expect(attempts[1]).toBe(3);
  });

  it('invokes onFailure for each rejection with willRetry flag', async () => {
    const onFailure = jest.fn();
    let count = 0;
    await retrySettled(
      ['a'],
      () => {
        count++;
        if (count < 2) return Promise.reject(new Error('boom'));
        return Promise.resolve('ok');
      },
      { maxAttempts: 3, onFailure },
    );

    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledWith({
      attempt: 1,
      error: expect.any(Error),
      item: 'a',
      willRetry: true,
    });
  });

  it('marks willRetry=false on the final attempt', async () => {
    const onFailure = jest.fn();
    await expect(
      retrySettled(['a'], async () => Promise.reject(new Error('x')), {
        maxAttempts: 2,
        onFailure,
      }),
    ).rejects.toThrow('x');

    expect(onFailure).toHaveBeenCalledTimes(2);
    expect(onFailure.mock.calls[0][0].willRetry).toBe(true);
    expect(onFailure.mock.calls[1][0].willRetry).toBe(false);
  });

  it('handles an empty input array', async () => {
    const results = await retrySettled([], () => Promise.resolve('never'));
    expect(results).toEqual([]);
  });
});
