jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
import { sleep } from './sleep';

describe('sleep', () => {
  it('waits the specified amount of time before proceeding', async () => {
    const waitMs = 50;
    await Promise.resolve().then(() => jest.advanceTimersByTime(100));
    await sleep(waitMs);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 50);
  });
});
