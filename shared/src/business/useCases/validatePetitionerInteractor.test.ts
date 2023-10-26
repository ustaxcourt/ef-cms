import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { RawContact } from '@shared/business/entities/contacts/Contact';
import { applicationContext } from '../test/createTestApplicationContext';
import { validatePetitionerInteractor } from './validatePetitionerInteractor';

describe('validatePetitionerInteractor', () => {
  let mockContact;

  beforeEach(() => {
    mockContact = {
      address1: '100 Main St.',
      address2: 'Grand View Apartments',
      address3: 'Apt. #104',
      city: 'Jordan',
      confirmEmail: 'night@example.com',
      contactId: '9ec8bf37-678a-489d-be6d-13121331768b',
      contactType: CONTACT_TYPES.primary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Wilbur Rayou',
      phone: '1111111111',
      postalCode: '55352',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      state: 'MN',
      updatedEmail: 'night@example.com',
    } as RawContact & { confirmEmail?: string; updatedEmail?: string };
  });

  it('should not return validation errors when the updated contact information is valid', () => {
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: mockContact,
    });

    expect(errors).toBeUndefined();
  });

  it('should not return validation errors when the updated contact is valid and updatedEmail and confirmEmail are not present', () => {
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: {
        ...mockContact,
        confirmEmail: undefined,
        updatedEmail: undefined,
      },
    });

    expect(errors).toBeUndefined();
  });

  it('should return validation errors when the updated contact is NOT valid', () => {
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: {
        ...mockContact,
        confirmEmail: undefined, // required when updatedEmail is present
        postalCode: 'what is love', // invalid postal code
        serviceIndicator: undefined, // required
      },
    });

    expect(errors).toEqual({
      confirmEmail: 'Enter a valid email address',
      postalCode: 'Enter ZIP code',
      serviceIndicator: 'Select a service indicator',
    });
  });

  it('should return validation errors when a confirmation email was provided without an updated email', () => {
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: {
        ...mockContact,
        confirmEmail: 'night@example.com',
        updatedEmail: undefined,
      },
    });

    expect(errors).toEqual({
      confirmEmail: 'Email addresses do not match',
      email: 'Enter a valid email address',
    });
  });

  it('should return validation errors when attempting to update an existing petitioner to an intervenor when an intervenor is already associated with the case', () => {
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [
        {
          ...mockContact,
          contactId: '3ec8aa37-67aa-489d-be6d-13121331768b',
          contactType: CONTACT_TYPES.intervenor,
        },
        mockContact,
      ],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: {
        ...mockContact,
        contactType: CONTACT_TYPES.intervenor,
      },
    });

    expect(errors).toEqual({
      'petitioners[1]':
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    });
  });
});
