const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('markAsSentToIRS', () => {
  it('updates case status to general docket not at issue', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );
    caseRecord.markAsSentToIRS();
    expect(caseRecord.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });
});
