const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../../test/mockCase');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES, CONTACT_TYPES } = require('../EntityConstants');

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

  it('sets the contactType to petitioner for all primary, secondary and other petitioners', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      },
      {
        applicationContext,
      },
    );

    caseRecord.markAsSentToIRS();

    expect(caseRecord.petitioners[0].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );
    expect(caseRecord.petitioners[5].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );
  });

  it('does not change the contactType for intervenors and participants', () => {
    const caseRecord = new Case(
      {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS,
      },
      {
        applicationContext,
      },
    );

    caseRecord.markAsSentToIRS();

    expect(caseRecord.petitioners[1].contactType).toEqual(
      CONTACT_TYPES.participant,
    );
  });
});
