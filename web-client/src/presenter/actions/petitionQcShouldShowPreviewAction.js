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
export const petitionQcShouldShowPreviewAction = async ({ path, props }) => {
  if (props.file) {
    return path.pdfInMemory({ file: props.file });
  }

  if (props.selectedDocument) {
    return path.pdfInS3({ selectedDocumen: props.selectedDocumentt });
  }

  return path.no();
};
