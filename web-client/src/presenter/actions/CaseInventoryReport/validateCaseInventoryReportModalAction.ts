import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates the case inventory report modal
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCaseInventoryReportModalAction = ({
  get,
  path,
}: ActionProps) => {
  const { associatedJudge, status } = get(state.screenMetadata);

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
