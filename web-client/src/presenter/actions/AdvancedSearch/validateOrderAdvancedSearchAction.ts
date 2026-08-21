import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { DATE_RANGE_SEARCH_OPTIONS } from '@shared/business/entities/EntityConstants';
import { OrderSearchValidation } from '@web-client/business/entities/orderSearch/OrderSearchValidation';
import {
  createISODateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

export const validateOrderAdvancedSearchAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);

  const formattedStartDate = orderSearch.startDate
    ? createISODateString(orderSearch.startDate, FORMATS.MMDDYYYY)
    : undefined;
  const formattedEndDate = orderSearch.endDate
    ? createISODateString(orderSearch.endDate, FORMATS.MMDDYYYY)
    : undefined;

  const errors = new OrderSearchValidation({
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
