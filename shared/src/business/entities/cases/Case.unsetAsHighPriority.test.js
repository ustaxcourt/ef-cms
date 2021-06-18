const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('unsetAsHighPriority', () => {
  it('unsets the case as high priority', () => {
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        highPriority: true,
        highPriorityReason: 'because reasons',
      },
      {
        applicationContext,
      },
    );

    expect(caseToUpdate.highPriority).toBeTruthy();

    caseToUpdate.unsetAsHighPriority();

    expect(caseToUpdate.highPriority).toBeFalsy();
    expect(caseToUpdate.highPriorityReason).toBeUndefined();
  });
});
