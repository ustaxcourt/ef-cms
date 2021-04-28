const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getOtherPetitionerContact,
} = require('../contacts/OtherPetitionerContact');
const { Case } = require('./Case');
const { CONTACT_TYPES, COUNTRY_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addPetitioner', () => {
  it('should add the petitioner to the petitioners array and return the updated case', () => {
    const caseEntity = new Case(MOCK_CASE, { applicationContext });

    const OtherPetitionerContact = getOtherPetitionerContact({});

    const petitionerEntity = new OtherPetitionerContact(
      {
        address1: '123 Tomato Street',
        city: 'Tomatotown',
        contactType: CONTACT_TYPES.otherPetitioner,
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Susie Tomato',
        phone: '123456',
        postalCode: '99999',
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
