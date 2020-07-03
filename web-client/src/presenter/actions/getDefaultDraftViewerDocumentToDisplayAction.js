import { state } from 'cerebral';

/**
 * gets the first draft document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDraftViewerDocumentToDisplayAction = ({
  get,
  props,
}) => {
  const { documentId } = props;
  let viewerDraftDocumentToDisplay = null;

  const caseDetail = get(state.formattedCaseDetail);

  if (documentId) {
    viewerDraftDocumentToDisplay = caseDetail.formattedDraftDocuments.find(
      d => d.documentId === documentId,
    );
  } else if (caseDetail.formattedDraftDocuments) {
    viewerDraftDocumentToDisplay = caseDetail.formattedDraftDocuments[0];
  }

  return {
    viewerDraftDocumentToDisplay,
  };
};
