import { state } from 'cerebral';

/**
 * checks if we are editing a docket entry or creating a new one
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const isEditModeAction = ({ get, path }) => {
  // if state.documentId is set, we should assume we are editing a docket entry
  return get(state.documentId) ? path.yes() : path.no();
};
