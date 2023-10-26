import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
import { Contact } from '../entities/contacts/Contact';
import { MOCK_CASE } from '@shared/test/mockCase';
import { Petitioner } from '../entities/contacts/Petitioner';
import { UpdateUserEmail } from '../entities/UpdateUserEmail';
import { applicationContext } from '../test/createTestApplicationContext';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { validatePetitionerInteractor } from './validatePetitionerInteractor';

describe('validatePetitionerInteractor', () => {
  let mockContact;
  const updateUserEmailCustomMessages = extractCustomMessages(
    UpdateUserEmail.VALIDATION_RULES,
  );
  const petitionerCustomMessages = extractCustomMessages(
    Petitioner.VALIDATION_RULES,
  );
  const contactCustomMessages = extractCustomMessages(
    Contact.DOMESTIC_VALIDATION_RULES,
  );

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
    } as any;
  });

  it('runs validation on a contact with no invalid properties', () => {
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: mockContact,
    });

    expect(errors).toBeFalsy();
  });

  it('should not return validation errors when contact is valid and updatedEmail and confirmEmail are not present', () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined,
      updatedEmail: undefined,
    };

    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: mockContact,
    });

    expect(errors).toBeFalsy();
  });

  it('runs validation on a contact with invalid properties', () => {
    mockContact = {
      ...mockContact,
      confirmEmail: undefined, // required when updatedEmail is present
      postalCode: 'what is love', // invalid postal code
      serviceIndicator: undefined, // required
    };

    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: mockContact,
    });
    expect(errors).toEqual({
      confirmEmail: updateUserEmailCustomMessages.confirmEmail[1],
      postalCode: contactCustomMessages.postalCode[0],
      serviceIndicator: petitionerCustomMessages.serviceIndicator[0],
    });
  });

  it('runs validation on a secondary contact with invalid properties', () => {
    const contact = {
      ...mockContact,
      confirmEmail: undefined,
      postalCode: 'what is love',
    };
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [contact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: contact,
    });

    expect(errors).toEqual({
      confirmEmail: updateUserEmailCustomMessages.confirmEmail[1],
      postalCode: contactCustomMessages.postalCode[0],
    });
  });

  it('returns a validation error when confirmEmail is present without updatedEmail', () => {
    const contact = {
      ...mockContact,
      confirmEmail: 'night@example.com',
      postalCode: '',
      updatedEmail: undefined,
    };
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [contact],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: contact,
    });

    expect(errors).toEqual({
      confirmEmail: updateUserEmailCustomMessages.confirmEmail[0],
      email: updateUserEmailCustomMessages.email[0],
      postalCode: contactCustomMessages.postalCode[0],
    });
  });

  it('should not return an error when the first intervenor is edited', () => {
    const contact = {
      ...mockContact,
      address1: '200 Main St.',
    };
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [contact],
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: contact,
    });

    expect(errors).toBeFalsy();
  });

  it('should throw an error when attempting to update an existing petitioner to an intervenor if an intervenor is already associated with the case', () => {
    const contact = {
      ...mockContact,
      contactType: CONTACT_TYPES.intervenor,
    };
    const petitioner = {
      ...mockContact,
      contactId: '3ec8aa37-67aa-489d-be6d-13121331768b',
      contactType: CONTACT_TYPES.intervenor,
    };
    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [petitioner, mockContact],
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: contact,
    });

    expect(errors).toEqual({
      'petitioners[1]':
        'Only one (1) Intervenor is allowed per case. Please select a different Role.',
    });
  });

  it('should not edit the first intervenor when the contactType is not intervenor', () => {
    const contact = {
      ...mockContact,
      contactType: CONTACT_TYPES.otherFiler,
    };

    const caseDetail = {
      ...MOCK_CASE,
      petitioners: [contact],
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const errors = validatePetitionerInteractor(applicationContext, {
      caseDetail,
      contactInfo: contact,
    });

    expect(errors).toBeFalsy();
  });
});
