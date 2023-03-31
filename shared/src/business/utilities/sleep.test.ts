import { sleep } from './sleep';

describe('sleep', () => {
  it('waits the specified amount of time before proceeding', async () => {
    const start = new Date().getTime();
    const waitMs = 500;

    await sleep(500);
    const finish = new Date().getTime();
    expect(finish).toBeGreaterThan(start + waitMs);
  });
});
