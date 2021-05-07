const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE_WITHOUT_PENDING } = require('../../../test/mockCase');

describe('unupdateAutomaticBlocked', () => {
  it('unsets the case as automatic blocked', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE_WITHOUT_PENDING,
        automaticBlocked: true,
        automaticBlockedReason: 'because reasons',
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.automaticBlocked).toBeTruthy();

    caseToUpdate.updateAutomaticBlocked({});

    expect(caseToUpdate.automaticBlocked).toBeFalsy();
    expect(caseToUpdate.automaticBlockedReason).toBeUndefined();
    expect(caseToUpdate.automaticBlockedDate).toBeUndefined();
  });
});
