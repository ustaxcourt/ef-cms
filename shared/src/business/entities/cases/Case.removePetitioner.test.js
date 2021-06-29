const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case, getContactPrimary } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('removePetitioner', () => {
  it('should remove the petitioner by contactId from the petitioners array', () => {
    const caseEntity = new Case(MOCK_CASE, { applicationContext });
    const numberOfPetitionersOnCase = caseEntity.petitioners.length;
    expect(caseEntity.petitioners.length).toEqual(numberOfPetitionersOnCase);

    caseEntity.removePetitioner(getContactPrimary(MOCK_CASE).contactId);

    expect(caseEntity.petitioners.length).toEqual(
      numberOfPetitionersOnCase - 1,
    );
  });
});
