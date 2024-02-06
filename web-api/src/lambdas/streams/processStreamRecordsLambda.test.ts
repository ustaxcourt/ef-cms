import { processStreamRecordsLambda } from './processStreamRecordsLambda';

describe('processStreamRecordsLambda', () => {
  it('should throw an exception if the interactor throws an exception', async () => {
    let error;
    try {
      // @ts-ignore - this error is intentional
      await processStreamRecordsLambda(null);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
