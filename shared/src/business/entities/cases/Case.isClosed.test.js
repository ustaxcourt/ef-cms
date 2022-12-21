const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('isClosed', () => {
  it('should be true when case status is "Closed"', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.closed,
      },
      {
        applicationContext,
      },
    );

    expect(caseEntity.isClosed()).toBe(true);
  });

  it('should be true when case status is "Closed - Dismissed"', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.closedDismissed,
      },
      {
        applicationContext,
      },
    );

    expect(caseEntity.isClosed()).toBe(true);
  });

  it('should be false when case status is "New"', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      },
      {
        applicationContext,
      },
    );

    expect(caseEntity.isClosed()).toBe(false);
  });
});
