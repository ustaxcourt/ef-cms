const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../EntityConstants');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { Petitioner } = require('../contacts/Petitioner');

describe('addPetitioner', () => {
  it('should add the petitioner to the petitioners array and return the updated case', () => {
    const caseEntity = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.generalDocket },
      { applicationContext },
    );

    const petitionerEntity = new Petitioner(
      {
        address1: '123 Tomato Street',
        city: 'Tomatotown',
        contactType: CONTACT_TYPES.otherPetitioner,
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Susie Tomato',
        phone: '123456',
        postalCode: '99999',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'KS',
      },
      {
        applicationContext,
      },
    );

    expect(caseEntity.petitioners.length).toEqual(1);

    const updatedCase = caseEntity.addPetitioner(petitionerEntity);

    expect(caseEntity.isValid()).toBeTruthy();
    expect(updatedCase.petitioners.length).toEqual(2);
  });
});
