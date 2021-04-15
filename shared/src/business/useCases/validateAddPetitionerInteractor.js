const {
  getOtherPetitionerContact,
} = require('../entities/contacts/OtherPetitionerContact');
const { isEmpty } = require('lodash');

/**
 * validateAddPetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contact the contactInfo to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateAddPetitionerInteractor = ({ applicationContext, contact }) => {
  const OtherPetitionerContact = getOtherPetitionerContact({});

  const petitionerErrors = new OtherPetitionerContact(contact, {
    applicationContext,
  }).getFormattedValidationErrors();

  let caseCaptionError;
  if (!contact.caseCaption) {
    caseCaptionError = { caseCaption: 'Case caption is required' };
  }

  const aggregatedErrors = {
    ...petitionerErrors,
    ...caseCaptionError,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
