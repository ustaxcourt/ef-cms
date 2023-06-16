import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * validate the upload correspondence document form
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateUploadCorrespondenceDocumentAction = ({
  get,
  path,
}: ActionProps) => {
  const { documentTitle, primaryDocumentFile } = get(state.form);

  let errors: Record<string, string> = {};
  let errorDisplayOrder = ['documentTitle', 'primaryDocumentFile'];

  if (!documentTitle) {
    errors.documentTitle = 'Enter a description';
  }

  if (!primaryDocumentFile) {
    errors.primaryDocumentFile = 'Upload or scan a document';
  }

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      errorDisplayOrder,
      errors,
    });
  }
};
