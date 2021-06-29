import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate the remove from trial session form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context for getting constants
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateRemoveFromTrialSessionAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { associatedJudge, caseStatus, disposition } = get(state.modal);
  const { STATUS_TYPES_WITH_ASSOCIATED_JUDGE } =
    applicationContext.getConstants();

  let errors = {};
  if (!disposition) {
    errors.disposition = 'Enter a disposition';
  }

  if (!caseStatus) {
    errors.caseStatus = 'Enter a case status';
  }

  if (
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(caseStatus) &&
    !associatedJudge
  ) {
    errors.associatedJudge = 'Select an associated judge';
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
