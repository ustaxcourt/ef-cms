import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
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
    const mockExistingPetitioners = [
      {
        contactType: CONTACT_TYPES.intervenor,
      },
    ];

    const errors = validateAddPetitionerInteractor(applicationContext, {
      contact: mockContact,
      existingPetitioners: mockExistingPetitioners,
    });

    expect(errors).toEqual({
      contactType:
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    });
  });
});
