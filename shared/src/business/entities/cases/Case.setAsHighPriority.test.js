const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setAsHighPriority', () => {
  it('sets the case as high priority with a high priority reason', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.highPriority).toBeFalsy();

    caseToUpdate.setAsHighPriority('because reasons');

    expect(caseToUpdate.highPriority).toEqual(true);
    expect(caseToUpdate.highPriorityReason).toEqual('because reasons');
  });
});
