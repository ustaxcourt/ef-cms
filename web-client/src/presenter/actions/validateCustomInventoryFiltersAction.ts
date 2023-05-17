import { CUSTOM_CASE_INVENTORY_PAGE_SIZE } from '../../../../shared/src/business/entities/EntityConstants';
import { CustomCaseInventoryReportFilters } from '../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { CustomCaseInventorySearch } from '../../../../shared/src/business/entities/customCaseInventorySearch/CustomCaseInventorySearch';
import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

/**
 * Validates the judge activity report search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCustomInventoryFiltersAction = ({
  applicationContext,
  get,
  path,
  props,
}: {
  applicationContext: IApplicationContext;
  get: any;
  props: { selectedPage: number };
  store: any;
  path: any;
}) => {
  const filters: CustomCaseInventoryReportFilters = get(
    state.customCaseInventory.filters,
  );

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

  const lastIdsOfPages = get(state.customCaseInventory.lastIdsOfPages);
  const searchAfter = lastIdsOfPages[props.selectedPage];

  const errors = new CustomCaseInventorySearch({
    ...filters,
    endDate: formattedEndDate,
    pageSize: CUSTOM_CASE_INVENTORY_PAGE_SIZE,
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
