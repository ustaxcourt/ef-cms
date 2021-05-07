const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { AUTOMATIC_BLOCKED_REASONS } = require('../EntityConstants');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('updateAutomaticBlocked', () => {
  it('sets the case as automaticBlocked with a valid blocked reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.automaticBlocked).toBeFalsy();

    caseToUpdate.updateAutomaticBlocked({});

    expect(caseToUpdate.automaticBlocked).toEqual(true);
    expect(caseToUpdate.automaticBlockedReason).toEqual(
      AUTOMATIC_BLOCKED_REASONS.pending,
    );
    expect(caseToUpdate.automaticBlockedDate).toBeDefined();
    expect(caseToUpdate.isValid()).toBeTruthy();
  });
});
