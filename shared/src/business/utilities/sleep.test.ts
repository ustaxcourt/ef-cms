import { sleep } from './sleep';

describe('sleep', () => {
  it('waits the specified amount of time before proceeding', async () => {
    const start = new Date().getTime();
    const waitMs = 50;

    await sleep(waitMs);
    const finish = new Date().getTime();
    expect(finish).toBeGreaterThanOrEqual(start + waitMs);
  });
});
