import { state } from 'cerebral';

/**
 * returns the yes path when a primaryDocumentFile is set, or the no path otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of yes or no)
 * @returns {object} the next path based on if a primaryDocumentFile is set or not
 */
export const isFileAttachedAction = ({ get, path }) => {
  return get(state.form.primaryDocumentFile) ? path.yes() : path.no();
};
