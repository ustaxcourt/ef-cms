const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  verifyPendingCaseForUserInteractor,
} = require('./verifyPendingCaseForUserInteractor');

describe('verifyPendingCaseForUser', () => {
  it('should return results retrieved from persistence', async () => {
    const mockCaseRecord = {
      docketNumber: '123-19',
    };

    await verifyPendingCaseForUserInteractor({
      applicationContext,
      docketNumber: mockCaseRecord.docketNumber,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().verifyPendingCaseForUser,
    ).toBeCalled();
  });
});
