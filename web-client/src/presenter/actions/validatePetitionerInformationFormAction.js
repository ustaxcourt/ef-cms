import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validates the petitioner information form.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePetitionerInformationFormAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { contactPrimary, contactSecondary, partyType } = get(state.form);

  const {
    contactPrimary: oldContactPrimary,
    contactSecondary: oldContactSecondary,
  } = get(state.caseDetail);

  const serviceIndicatorError = {
    serviceIndicator:
      'You cannot change from paper to electronic service. Select a valid service preference.',
  };

  const errors = applicationContext
    .getUseCases()
    .validatePetitionerInformationFormInteractor({
      applicationContext,
      contactPrimary,
      contactSecondary,
      partyType,
    });

  if (
    ['Paper', 'None'].includes(oldContactPrimary.serviceIndicator) &&
    contactPrimary.serviceIndicator === 'Electronic'
  ) {
    errors.contactPrimary = {
      ...errors.contactPrimary,
      ...serviceIndicatorError,
    };
  }

  if (
    oldContactSecondary &&
    ['Paper', 'None'].includes(oldContactSecondary.serviceIndicator) &&
    contactSecondary.serviceIndicator === 'Electronic'
  ) {
    errors.contactSecondary = {
      ...errors.contactSecondary,
      ...serviceIndicatorError,
    };
  }

  if (isEmpty(errors.contactPrimary) && isEmpty(errors.contactSecondary)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
