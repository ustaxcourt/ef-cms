import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';
import { OpinionSearchValidation } from '@web-client/business/entities/opinionSearch/OpinionSearchValidation';
import {
  createISODateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

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

  const formattedStartDate = opinionSearch.startDate
    ? createISODateString(opinionSearch.startDate, FORMATS.MMDDYYYY)
    : undefined;
  const formattedEndDate = opinionSearch.endDate
    ? createISODateString(opinionSearch.endDate, FORMATS.MMDDYYYY)
    : undefined;

  const errors = new OpinionSearchValidation({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  }).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      alertError: {
        messages: Object.values(errors),
        title:
          'Errors were found. Please correct the date range selection and resubmit.',
      },
      errors,
    });
  }

  const opinionSearchErrors = applicationContext
    .getUseCases()
    .validateOpinionAdvancedSearchInteractor({
      opinionSearch: {
        ...opinionSearch,
        dateRange:
          opinionSearch.startDate || opinionSearch.endDate
            ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
            : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
      },
    });

  if (isEmpty(opinionSearchErrors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        messages: Object.values(opinionSearchErrors),
        title: 'Please correct the following errors:',
      },
      errors: opinionSearchErrors,
    });
  }
};
