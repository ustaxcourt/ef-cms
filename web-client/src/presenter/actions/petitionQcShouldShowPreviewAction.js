import { state } from 'cerebral';

/**
 * fixme
 * returns the yes path with file prop for the current document selected for scan, or the no path, otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral get method
 * @param {object} providers.path the next object in the path
 * @returns {undefined}
 */
export const petitionQcShouldShowPreviewAction = async ({ path, props }) => {
  if (props.fileFromBrowserMemory) {
    return path.pdfInMemory({ file: props.fileFromBrowserMemory });
  }

  if (props.documentInS3) {
    return path.pdfInS3({ file: props.documentInS3 });
  }

  return path.no();
};
