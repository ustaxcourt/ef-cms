const { processStreamRecordsLambda } = require('./processStreamRecordsLambda');

describe('processStreamRecordsLambda', () => {
  it('should throw an exception if the interactor throws an exception', async () => {
    let error;
    try {
      await processStreamRecordsLambda(null);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
