import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate case advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const validatePractitionerSearchByNameAction = async ({ get, path }) => {
  const { practitionerName } = get(
    state.advancedSearchForm.practitionerSearchByName,
  );
  const errors = {};

  if (!practitionerName) {
    errors.practitionerName = 'Enter a practitioner name';
  }

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
