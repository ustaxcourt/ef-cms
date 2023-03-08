const {
  applicationContext,
} = require('../../../shared/src/business/test/createTestApplicationContext');
const { scanMessages } = require('./worker.helper');

describe('scanMessages', () => {
  it('should call virus scan interactor for each message', async () => {
    await scanMessages({
      applicationContext,
      messages: [{ id: 1 }, { id: 2 }],
    });

    expect(
      applicationContext.getUseCases().virusScanPdfInteractor,
    ).toHaveBeenCalledTimes(2);
  });
});
