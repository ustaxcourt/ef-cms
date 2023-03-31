import { state } from 'cerebral';
/**
 * Validates the judge activity report search form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateJudgeActivityReportSearchAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  console.log('props ', props);
  console.log(get(state.form));
  const errors = applicationContext
    .getUseCases()
    .validateJudgeActivityReportSearchInteractor(applicationContext, {
      endDate: props.computedEndDate,
      startDate: props.computedStartDate,
    });

  if (errors) {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }

  return path.success();
};
