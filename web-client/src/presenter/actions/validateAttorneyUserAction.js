/**
 * validates the attorney user data
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */

export const validateAttorneyUserAction = ({ path }) => {
  return path.success(); // TODO: this stuff.
};
