import { ContactFactory } from '../entities/contacts/ContactFactory';
import { RawContact } from '../entities/contacts/Contact';
import { isEmpty } from 'lodash';

/**
 * validatePetitionerInformationFormInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactPrimary the contactPrimary to validate
 * @param {object} providers.contactSecondary the contactSecondary to validate
 * @param {object} providers.partyType the partyType to validate
 * @returns {object} errors (null if no errors)
 */
export const validatePetitionerInformationFormInteractor = (
  applicationContext: IApplicationContext,
  {
    contactPrimary,
    contactSecondary,
    partyType,
  }: {
    contactPrimary: RawContact;
    contactSecondary: RawContact;
    partyType: string;
  },
) => {
  const contacts = ContactFactory({
    applicationContext,
    contactInfo: { primary: contactPrimary, secondary: contactSecondary },
    partyType,
  });

  return {
    contactPrimary: contacts.primary.getFormattedValidationErrors(),
    contactSecondary: isEmpty(contacts.secondary)
      ? {}
      : contacts.secondary.getFormattedValidationErrors(),
  };
};
