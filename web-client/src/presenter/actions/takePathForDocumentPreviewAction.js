/**
 * returns the path to take based on teh available props for where a document is located
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral get method
 * @param {object} providers.path the next object in the path
 * @returns {object} path execution results
 */
export const takePathForDocumentPreviewAction = async ({ path, props }) => {
  if (props.fileFromBrowserMemory) {
    return path.pdfInMemory({ file: props.fileFromBrowserMemory });
  }

  if (props.documentInS3) {
    return path.pdfInS3({ file: props.documentInS3 });
  }

  return path.no();
};
