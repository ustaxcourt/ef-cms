import { sleep } from '@shared/tools/helpers';

export const runInBatches = async (
  tasks: (() => Promise<any>)[],
  concurrency: number = 15,
  rest: number = 1000, // ms
  breakOnError: boolean = false,
) => {
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    console.log(
      'running batch:',
      batch.map((_, idx) => i + idx),
    );
    try {
      await Promise.all(batch.map(fn => fn()));
    } catch (err) {
      console.error('Error in batch:', err);
      if (breakOnError) {
        throw err;
      }
    }
    if (rest && rest > 0) await sleep(rest);
  }
};
