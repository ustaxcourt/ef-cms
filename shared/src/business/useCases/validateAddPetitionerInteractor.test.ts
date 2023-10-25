import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
import { MOCK_LEAD_CASE_WITH_PAPER_SERVICE } from '@shared/test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { validateAddPetitionerInteractor } from './validateAddPetitionerInteractor';

describe('validateAddPetitionerInteractor', () => {
  let mockContact;

  beforeEach(() => {
    mockContact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      caseCaption: 'Caption this',
      city: 'Jordan',
      contactType: CONTACT_TYPES.otherPetitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      state: 'MN',
    };
  });

  it("should not return validation errors when contact is valid and it's a valid petitioner to add to the case", () => {
    const errors = validateAddPetitionerInteractor(applicationContext, {
      caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      contact: mockContact,
    });

    expect(errors).toBeUndefined();
  });

  it('should return errors when the contact to add is invalid', () => {
    const errors = validateAddPetitionerInteractor(applicationContext, {
      caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      contact: {
        ...mockContact,
        address1: undefined, // Address 1 is a required property
      },
    });

    expect(errors).toEqual({
      address1: 'Enter mailing address',
    });
  });

  it('should return errors when the user attempts to delete the case caption', () => {
    const errors = validateAddPetitionerInteractor(applicationContext, {
      caseDetail: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      contact: {
        ...mockContact,
        caseCaption: undefined,
      },
    });

    expect(errors).toEqual({
      caseCaption: 'Enter a case caption',
    });
  });

  it('should return an error when second intervenor is added', () => {
    const errors = validateAddPetitionerInteractor(applicationContext, {
      caseDetail: {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        petitioners: [
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners,
          {
            address1: '42 Lamb Sauce Blvd',
            city: 'Nashville',
            contactId: '3afced53-75e0-4477-b66c-bc1fade2183e',
            contactType: CONTACT_TYPES.intervenor,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'gordon@example.com',
            entityName: 'Petitioner',
            isAddressSealed: false,
            name: 'Gordon Ramsay',
            phone: '1234567890',
            postalCode: '05198',
            sealedAndUnavailable: false,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            state: 'AK',
            title: 'Intervenor',
          },
        ],
      },
      contact: {
        ...mockContact,
        contactType: CONTACT_TYPES.intervenor,
      },
    });

    expect(errors).toEqual({
      ['petitioners[3]']:
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    });
  });
});
