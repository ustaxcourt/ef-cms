import { state } from '@web-client/presenter/app.cerebral';

/**
 * Validates the new minute sheet modal form on submit
 * Checks that a case has been selected via the checkbox
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path for success/error routing
 * @returns {object} the next path based on validation result
 */
export const validateNewMinuteSheetModalAction = ({
  get,
  path,
}: ActionProps) => {
  const form = get(state.modal.form) || {};
  const caseInfo = get(state.modal.caseInfo);

  // Check if user has searched for a case
  if (!caseInfo) {
    return path.error({
      errors: {
        caseSelected: 'Search for a case',
      },
    });
  }

  // Check if case is selected via checkbox
  if (!form.caseSelected) {
    return path.error({
      errors: {
        caseSelected: 'Select a case',
      },
    });
  }

  return path.success({
    caseInfo,
  });
};
