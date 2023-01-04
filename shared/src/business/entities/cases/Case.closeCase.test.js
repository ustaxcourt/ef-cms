const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CLOSED_CASE_STATUSES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('closeCase', () => {
  it('should update the status of the case to the closed status provided when it is a valid closed status', () => {
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

    myCase.closeCase({ closedStatus: CLOSED_CASE_STATUSES[0] });

    expect(myCase).toMatchObject({
      blocked: false,
      blockedDate: undefined,
      blockedReason: undefined,
      closedDate: expect.anything(),
      highPriority: false,
      highPriorityReason: undefined,
      status: CLOSED_CASE_STATUSES[0],
    });
  });
});
