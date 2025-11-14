import { state } from '@web-client/presenter/app.cerebral';

/**
 * Validates the remote trial permission modal data
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateRemoteTrialPermissionAction = ({
  applicationContext,
  get,
  path,
}) => {
  const remoteTrialGrantedDate = get(state.modal.remoteTrialGrantedDate);
  const existingRemoteTrialGrantedDate = get(
    state.caseDetail.remoteTrialGrantedDate,
  );

  if (!remoteTrialGrantedDate || remoteTrialGrantedDate.trim() === '') {
    if (existingRemoteTrialGrantedDate) {
      return path.success();
    }
    return path.error({
      errors: { remoteTrialGrantedDate: 'Enter a valid date' },
    });
  }

  const { DATE_FORMATS } = applicationContext.getConstants();
  const isValidDate = applicationContext
    .getUtilities()
    .isValidDateString(remoteTrialGrantedDate, [DATE_FORMATS.ISO]);

  if (!isValidDate) {
    return path.error({
      errors: { remoteTrialGrantedDate: 'Format date as MM/DD/YYYY' },
    });
  }
  const isPastDate = applicationContext
    .getUtilities()
    .isValidPastDate(remoteTrialGrantedDate);

  if (!isPastDate) {
    return path.error({
      errors: { remoteTrialGrantedDate: 'Date cannot be in the future' },
    });
  }
  return path.success();
};
