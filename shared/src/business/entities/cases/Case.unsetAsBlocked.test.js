const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('unsetAsBlocked', () => {
  it('unsets the case as blocked', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        blocked: true,
        blockedReason: 'because reasons',
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.blocked).toBeTruthy();

    caseToUpdate.unsetAsBlocked();

    expect(caseToUpdate.blocked).toBeFalsy();
    expect(caseToUpdate.blockedReason).toBeUndefined();
    expect(caseToUpdate.blockedDate).toBeUndefined();
  });
});
