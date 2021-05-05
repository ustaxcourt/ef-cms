const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('closeCase', () => {
  it('should update the status of the case to closed and add a closedDate', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        blocked: true,
        blockedDate: '2019-03-01T21:40:46.415Z',
        blockedReason: 'something else',
        highPriority: true,
        highPriorityReason: 'something',
      },
      {
        applicationContext,
      },
    );
    myCase.closeCase();
    expect(myCase).toMatchObject({
      blocked: false,
      blockedDate: undefined,
      blockedReason: undefined,
      closedDate: expect.anything(),
      highPriority: false,
      highPriorityReason: undefined,
      status: CASE_STATUS_TYPES.closed,
    });
  });
});
