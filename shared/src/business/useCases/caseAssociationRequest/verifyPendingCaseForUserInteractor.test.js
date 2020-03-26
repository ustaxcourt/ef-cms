const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  verifyPendingCaseForUserInteractor,
} = require('./verifyPendingCaseForUserInteractor');

describe('verifyPendingCaseForUser', () => {
  it('should return results retrieved from persistence', async () => {
    const mockCaseRecord = {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '123-19',
    };

    await verifyPendingCaseForUserInteractor({
      applicationContext,
      caseId: mockCaseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().verifyPendingCaseForUser,
    ).toBeCalled();
  });
});
