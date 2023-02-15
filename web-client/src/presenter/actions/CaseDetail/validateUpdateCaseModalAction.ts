import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate the update case modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting state.modal
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateUpdateCaseModalAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { associatedJudge, caseCaption, caseStatus } = get(state.modal);
  const { STATUS_TYPES_WITH_ASSOCIATED_JUDGE } =
    applicationContext.getConstants();

  let errors = {};
  if (
    STATUS_TYPES_WITH_ASSOCIATED_JUDGE.includes(caseStatus) &&
    !associatedJudge
  ) {
    errors.associatedJudge = 'Select an associated judge';
  }
  if (!caseCaption) {
    errors.caseCaption = 'Enter a case caption';
  }
  if (!caseStatus) {
    errors.caseStatus = 'Select a case status';
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
