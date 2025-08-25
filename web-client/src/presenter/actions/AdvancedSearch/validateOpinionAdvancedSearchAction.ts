import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';

/**
 * validate opinion advanced search form
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
}: ActionProps) => {
  const opinionSearch = get(state.advancedSearchForm.opinionSearch);

  const opinionTypes = Object.keys(opinionSearch.opinionTypes).filter(
    opinionType => opinionSearch.opinionTypes[opinionType] === true,
  );

  const errors = applicationContext
    .getUseCases()
    .validateOpinionAdvancedSearchInteractor({
      opinionSearch: {
        ...opinionSearch,
        opinionTypes,
        dateRange:
          opinionSearch.startDate || opinionSearch.endDate
            ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
            : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
      },
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
