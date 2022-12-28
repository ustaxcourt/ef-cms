const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('reopenCase', () => {
  it('should set closedDate to undefined and set the case status to the provided status', () => {
    const mockReopenedStatus = CASE_STATUS_TYPES.generalDocket;

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        caseStatus: CASE_STATUS_TYPES.closed,
        closedDate: '2019-08-25T05:00:00.000Z',
      },
      {
        applicationContext,
      },
    );

    caseEntity.reopenCase({ reopenedStatus: mockReopenedStatus });

    expect(caseEntity.closedDate).toBeUndefined();
    expect(caseEntity.status).toBe(mockReopenedStatus);
  });
});
