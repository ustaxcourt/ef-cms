import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the privatePractitioners on the modal form for the edit counsel modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateEditPetitionerCounselAction = ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const { SERVICE_INDICATOR_ERROR, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();

  const practitioner = get(state.form);
  const { privatePractitioners: oldPractitioners } = get(state.caseDetail);

  let validationErrors = applicationContext
    .getUseCases()
    .validateEditPetitionerCounselInteractor({
      practitioner,
    });

  const oldPractitioner = oldPractitioners.find(
    foundPractitioner => foundPractitioner.userId === practitioner.userId,
  );

  if (
    [
      SERVICE_INDICATOR_TYPES.SI_PAPER,
      SERVICE_INDICATOR_TYPES.SI_NONE,
    ].includes(oldPractitioner.serviceIndicator) &&
    practitioner.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
  ) {
    validationErrors = {
      ...validationErrors,
      ...SERVICE_INDICATOR_ERROR,
    };
  }

  store.set(state.validationErrors, validationErrors);

  if (isEmpty(validationErrors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: validationErrors,
    });
  }
};
