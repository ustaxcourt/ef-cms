import { state } from 'cerebral';

/**
 * fixme
 * returns the yes path with file prop for the current document selected for scan, or the no path, otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.path the next object in the path
 * @returns {undefined}
 */
export const newAction = async ({ applicationContext, get, path }) => {
  const { INITIAL_DOCUMENT_TYPES_MAP } = applicationContext.getConstants();
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );
  const documentTypeSelectedForPreview =
    INITIAL_DOCUMENT_TYPES_MAP[documentSelectedForPreview];
  const file = get(state.form[documentSelectedForPreview]);

  if (file) {
    return { fileFromBrowserMemory: file };
  }

  const { documents } = get(state.form);
  const selectedDocument = get(documents).find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  return { documentInS3: selectedDocument };
};
