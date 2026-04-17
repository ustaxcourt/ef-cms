import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { BarNumberSearchValidation } from '@shared/business/entities/BarNumberSearchValidation';

/**
 * validate practitioner search by bar number form
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 ≈
 * @returns {Promise<*>} the success or error path
 */
export const validatePractitionerSearchByBarNumberAction = ({
  get,
  path,
  store,
}: ActionProps) => {
  const { barNumber } = get(
    state.advancedSearchForm.practitionerSearchByBarNumber,
  );

  const trimmedBarNumber = barNumber?.trim();

  store.set(
    state.advancedSearchForm.practitionerSearchByBarNumber.barNumber,
    trimmedBarNumber,
  );

  const errors = new BarNumberSearchValidation({
    barNumber: trimmedBarNumber,
  }).getFormattedValidationErrors();

  const isValid = isEmpty(errors);

  if (isValid) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        messages: Object.values(errors),
        title: 'Please correct the following errors:',
      },
      errors,
    });
  }
};
