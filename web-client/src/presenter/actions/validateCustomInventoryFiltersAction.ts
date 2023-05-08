import { FORMATS } from '../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

/**
 * Validates the judge activity report search form
 *
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
}) => {
  const { createEndDate, createStartDate } = get(
    state.customCaseInventory.filters,
  );

  const formattedEndDate = createEndDate
    ? applicationContext
        .getUtilities()
        .createISODateString(createEndDate, FORMATS.MMDDYYYY)
    : undefined;

  const formattedStartDate = createStartDate
    ? applicationContext
        .getUtilities()
        .createISODateString(createStartDate, FORMATS.MMDDYYYY)
    : undefined;

  const errors = applicationContext
    .getUseCases()
    .validateCustomCaseInventorySearchFiltersInteractor(applicationContext, {
      endDate: formattedEndDate,
      startDate: formattedStartDate,
    });

  if (errors) {
    return path.error({
      alertError: {
        messages: Object.values(errors),
        title:
          'Errors were found. Please correct the date range selection and resubmit.', // TODO: Refactor
      },
      errors,
    });
  }

  return path.success();
};
