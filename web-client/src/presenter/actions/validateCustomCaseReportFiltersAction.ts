import { CUSTOM_CASE_REPORT_PAGE_SIZE } from '../../../../shared/src/business/entities/EntityConstants';
import { CustomCaseReportSearch } from '../../../../shared/src/business/entities/customCaseReportSearch/CustomCaseReportSearch';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const validateCustomCaseReportFiltersAction = ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{ selectedPage: number }>) => {
  const filters = get(state.customCaseReport.filters);

  const formattedEndDate = filters.endDate
    ? applicationContext
        .getUtilities()
        .createISODateString(filters.endDate, FORMATS.MMDDYYYY)
    : undefined;

  const formattedStartDate = filters.startDate
    ? applicationContext
        .getUtilities()
        .createISODateString(filters.startDate, FORMATS.MMDDYYYY)
    : undefined;

  const lastIdsOfPages = get(state.customCaseReport.lastIdsOfPages);
  const searchAfter = lastIdsOfPages[props.selectedPage];

  const errors = new CustomCaseReportSearch({
    ...filters,
    endDate: formattedEndDate,
    pageSize: CUSTOM_CASE_REPORT_PAGE_SIZE,
    searchAfter,
    startDate: formattedStartDate,
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

  return path.success();
};
