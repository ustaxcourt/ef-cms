import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * Validates petitioner information and redirects user to success or error path
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.path the cerebral path helper function
 * @param {object} providers.store the cerebral store object
 * @returns {object} path.success or path.error
 */
export const validatePetitionerAction = ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const {
    SERVICE_INDICATOR_ERROR,
    SERVICE_INDICATOR_TYPES,
  } = applicationContext.getConstants();

  const { contact } = get(state.form);
  const caseDetail = get(state.caseDetail);

  let errors =
    applicationContext
      .getUseCases()
      .validatePetitionerInteractor(applicationContext, {
        contactInfo: contact,
        existingPetitioners: caseDetail.petitioners,
      }) || {};

  const caseContact = applicationContext
    .getUtilities()
    .getPetitionerById(caseDetail, contact.contactId);
  if (
    [
      SERVICE_INDICATOR_TYPES.SI_PAPER,
      SERVICE_INDICATOR_TYPES.SI_NONE,
    ].includes(caseContact.serviceIndicator) &&
    contact.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
  ) {
    errors = {
      ...errors,
      ...SERVICE_INDICATOR_ERROR,
    };
  }

  store.set(state.validationErrors.contact, errors);

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
