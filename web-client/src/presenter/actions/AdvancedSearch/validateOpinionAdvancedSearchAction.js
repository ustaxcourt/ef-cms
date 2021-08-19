import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate opinion advanced search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.path the cerebral path options
 * @returns {Promise} async action
 */
export const validateOpinionAdvancedSearchAction = ({
  applicationContext,
  get,
  path,
}) => {
  const opinionSearch = get(state.advancedSearchForm.opinionSearch);
  const errors = applicationContext
    .getUseCases()
    .validateOpinionAdvancedSearchInteractor(applicationContext, {
      opinionSearch,
    });

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
