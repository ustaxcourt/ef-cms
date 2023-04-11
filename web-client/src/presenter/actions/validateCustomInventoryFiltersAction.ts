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
    state.customCaseInventoryFilters,
  );

  const errors = applicationContext
    .getUseCases()
    .validateJudgeActivityReportSearchInteractor(applicationContext, {
      endDate: createEndDate,
      startDate: createStartDate,
    });

  console.log('errors', errors);

  if (errors) {
    return path.error({
      errors,
    });
  }

  return path.success();
};
