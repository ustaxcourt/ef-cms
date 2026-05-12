import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';
import { OrderSearchValidation } from '@web-client/business/entities/orderSearch/OrderSearchValidation';
import { tryParseFormDateStringToIso } from '@shared/business/utilities/DateHandler';

export const validateOrderAdvancedSearchAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);

  const startParsed = tryParseFormDateStringToIso(orderSearch.startDate);
  const endParsed = tryParseFormDateStringToIso(orderSearch.endDate);

  if (startParsed.invalid || endParsed.invalid) {
    const parseErrors: Record<string, string> = {};
    if (startParsed.invalid) {
      parseErrors.startDate = 'Enter date in format MM/DD/YYYY.';
    }
    if (endParsed.invalid) {
      parseErrors.endDate = 'Enter date in format MM/DD/YYYY.';
    }
    return path.error({
      alertError: {
        messages: Object.values(parseErrors),
        title:
          'Errors were found. Please correct the date range selection and resubmit.',
      },
      errors: parseErrors,
    });
  }

  const errors = new OrderSearchValidation({
    startDate: startParsed.iso,
    endDate: endParsed.iso,
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

  const orderSearchErrors = applicationContext
    .getUseCases()
    .validateOrderAdvancedSearchInteractor({
      orderSearch: {
        ...orderSearch,
        dateRange:
          orderSearch.startDate || orderSearch.endDate
            ? DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES
            : DATE_RANGE_SEARCH_OPTIONS.ALL_DATES,
      },
    });

  if (isEmpty(orderSearchErrors)) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        messages: Object.values(orderSearchErrors),
        title: 'Please correct the following errors:',
      },
      errors: orderSearchErrors,
    });
  }
};
