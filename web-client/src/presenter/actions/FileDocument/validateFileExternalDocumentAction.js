import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * check to see if we can consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.path the next object in the path
 * @returns {object} the path to take next
 */
export const validateFileExternalDocumentAction = ({ get, path }) => {
  const casesToFileDocument = get(state.modal.casesToFileDocument);

  if (!isEmpty(casesToFileDocument)) {
    return path.success();
  } else {
    return path.error({ error: 'Select a case' });
  }
};
