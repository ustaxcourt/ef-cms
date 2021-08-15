import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate order advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.path the cerebral path options
 * @returns {Promise} async action
 */
export const validateOrderAdvancedSearchAction = ({
  applicationContext,
  get,
  path,
}) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);

  const errors = applicationContext
    .getUseCases()
    .validateOrderAdvancedSearchInteractor(applicationContext, {
      orderSearch,
    });

  if (isEmpty(errors)) {
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
