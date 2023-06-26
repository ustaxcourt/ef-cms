import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validate that we have cases for which to file an external document
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.path the next object in the path
 * @returns {object} the path to take next
 */
export const validateFileExternalDocumentAction = ({
  get,
  path,
}: ActionProps) => {
  const casesToFileDocument = get(state.modal.casesToFileDocument);

  if (!isEmpty(casesToFileDocument)) {
    return path.success();
  } else {
    return path.error({ error: 'Select a case' });
  }
};
