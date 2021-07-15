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
export const validateCaseDocketNumberSearchAction = ({ get, path }) => {
  const { docketNumber } = get(
    state.advancedSearchForm.caseSearchByDocketNumber,
  );
  const errors = {};

  if (!docketNumber) {
    errors.docketNumber = 'Enter a docket number';
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
