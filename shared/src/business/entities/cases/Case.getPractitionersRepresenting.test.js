const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getPractitionersRepresenting', () => {
  it('should return the practitioner associated with the contactId provided', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [{ representing: ['567'], userId: '567' }],
      },
      { applicationContext },
    );

    const practitioner = caseEntity.getPractitionersRepresenting('567');

    expect(practitioner).toMatchObject([
      {
        representing: ['567'],
        userId: '567',
      },
    ]);
  });

  it('should return an empty array if no practitioners are associated with the contactId provided', () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [{ representing: ['123'], userId: '567' }],
      },
      { applicationContext },
    );

    const practitioner = caseEntity.getPractitionersRepresenting('567');

    expect(practitioner).toMatchObject([]);
  });
});
