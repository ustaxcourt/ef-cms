/**
 * Validates the remote trial permission modal data
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateRemoteTrialPermissionAction = ({ path }) => {
  // No validation needed since the date is optional
  // If there's a date, it means granted; if no date, it means not granted
  return path.success();
};
