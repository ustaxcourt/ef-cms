/**
 * Returns the path to take in order to retrieve a document to preview
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.path the next object in the path
 * @returns {object} path execution results
 */
export const takePathForDocumentPreviewAction = ({ path, props }) => {
  if (props.fileFromBrowserMemory) {
    return path.pdfInMemory({ file: props.fileFromBrowserMemory });
  }

  if (props.documentInS3) {
    return path.documentInS3({ file: props.documentInS3 });
  }

  return path.no();
};
