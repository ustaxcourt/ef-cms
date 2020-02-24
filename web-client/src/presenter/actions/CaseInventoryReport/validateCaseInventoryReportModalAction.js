import { state } from 'cerebral';

/**
 * validates the trial session.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCaseInventoryReportModalAction = ({ get, path }) => {
  const { associatedJudge, status } = get(state.modal);

  let errors;
  if (!associatedJudge && !status) {
    errors = {
      associatedJudge: 'Select Judge',
      status: 'Select case status',
    };
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
