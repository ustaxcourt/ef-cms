import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
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

  it('should not return validation errors when contact is valid and a case caption is present', () => {
    const errors = validateAddPetitionerInteractor(applicationContext, {
      contact: mockContact,
    });

    expect(errors).toBeFalsy();
  });

  it('should return errors when the contact is invalid', () => {
    mockContact = {
      ...mockContact,
      address1: undefined,
      caseCaption: undefined,
    };

    const errors = validateAddPetitionerInteractor(applicationContext, {
      contact: mockContact,
    });

    expect(errors).toEqual({
      address1: 'Enter mailing address',
      caseCaption: 'Enter a case caption',
    });
  });

  it('should return an error when second intervenor is added', () => {
    mockContact = {
      ...mockContact,
      contactType: CONTACT_TYPES.intervenor,
    };

    const errors = validateAddPetitionerInteractor(applicationContext, {
      caseDetail: {
        ...MOCK_CASE,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            address1: '42 Lamb Sauce Blvd',
            city: 'Nashville',
            contactType: CONTACT_TYPES.intervenor,
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'gordon@example.com',
            name: 'Gordon Ramsay',
            phone: '1234567890',
            postalCode: '05198',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            state: 'AK',
            title: 'Intervenor',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      contact: mockContact,
    });

    expect(errors).toEqual({
      ['petitioners[2]']:
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    });
  });
});
