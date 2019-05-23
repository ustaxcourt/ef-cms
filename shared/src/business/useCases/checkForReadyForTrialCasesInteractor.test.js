const {
  checkForReadyForTrialCases,
} = require('./checkForReadyForTrialCasesInteractor');

describe('checkForReadyForTrialCases', () => {
  let applicationContext;

  it('should successfully run without error', async () => {
    applicationContext = {
      logger: {
        info: () => {},
      },
    };

    let error;

    try {
      checkForReadyForTrialCases({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });
});
