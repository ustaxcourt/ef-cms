import { COUNTRY_TYPES, ROLES } from './EntityConstants';
import { NewPractitioner } from './NewPractitioner';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('NewPractitioner', () => {
  const mockPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    birthYear: 2019,
    confirmEmail: 'test@example.com',
    contact: {
      address1: '234 Main St',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      country: 'Brazil',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    email: 'test@example.com',
    employer: 'Private',
    firmName: 'GW Law Offices',
    firstName: 'Test',
    lastName: 'Practitioner',
    originalBarState: 'IL',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
  };

  it('Creates a valid NewPractitioner with all required fields', () => {
    const user = new NewPractitioner(mockPractitioner);
    expect(user.isValid()).toBeTruthy();
  });

  it('Creates an invalid NewPractitioner with missing required fields', () => {
    const user = new NewPractitioner({
      role: ROLES.privatePractitioner,
    });
    const customMessages = extractCustomMessages(user.getValidationRules());

    expect(user.isValid()).toBeFalsy();
    expect(user.getFormattedValidationErrors()).toMatchObject({
      email: customMessages.email[0],
    });
  });

  it('Creates an invalid NewPractitioner with missing firstName and lastName', () => {
    const user = new NewPractitioner({
      ...mockPractitioner,
      firstName: undefined,
      lastName: undefined,
    });
    expect(user.isValid()).toBeFalsy();
  });

  describe('updating email', () => {
    const mockUpdatedEmail = 'hello@example.com';
    const invalidEmail = 'hello@';

    const validNewPractitioner = new NewPractitioner(mockPractitioner);

    it('passes validation when updatedEmail is undefined', () => {
      validNewPractitioner.updatedEmail = undefined;

      expect(validNewPractitioner.isValid()).toBeTruthy();
    });

    it('passes validation when email and confirmEmail match', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = mockUpdatedEmail;

      expect(validNewPractitioner.isValid()).toBeTruthy();
    });

    it('fails validation when email is not a valid email address', () => {
      validNewPractitioner.email = invalidEmail;
      validNewPractitioner.confirmEmail = undefined;
      const customMessages = extractCustomMessages(
        validNewPractitioner.getValidationRules(),
      );

      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[1],
        email: customMessages.email[0],
      });
    });

    it('fails validation when email is defined and confirmEmail is undefined', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = undefined;
      const customMessages = extractCustomMessages(
        validNewPractitioner.getValidationRules(),
      );
      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[1],
      });
    });

    it('fails validation when email is defined and confirmEmail is not a valid email address', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = invalidEmail;
      const customMessages = extractCustomMessages(
        validNewPractitioner.getValidationRules(),
      );
      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[1],
      });
    });

    it('fails validation when email and confirmEmail do not match', () => {
      validNewPractitioner.email = mockUpdatedEmail;
      validNewPractitioner.confirmEmail = 'abc' + mockUpdatedEmail;
      const customMessages = extractCustomMessages(
        validNewPractitioner.getValidationRules(),
      );
      expect(validNewPractitioner.isValid()).toBeFalsy();
      expect(validNewPractitioner.getFormattedValidationErrors()).toEqual({
        confirmEmail: customMessages.confirmEmail[0],
      });
    });
  });
});
