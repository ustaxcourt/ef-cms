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
  if (!remoteTrialGrantedDate) {
    return path.success();
  }
  const { DATE_FORMATS } = applicationContext.getConstants();
  const isValidDate = applicationContext
    .getUtilities()
    .isValidDateString(remoteTrialGrantedDate, [
      DATE_FORMATS.MMDDYYYY,
      DATE_FORMATS.MDYYYY,
    ]);
  if (!isValidDate) {
    return path.error({
      error: { remoteTrialGrantedDate: 'Format date as MM/DD/YYYY' },
    });
  }
  return path.success();
};
