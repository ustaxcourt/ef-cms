import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * gets the first draft document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDraftViewerDocumentToDisplayAction = ({
  applicationContext,
  get,
  props,
}) => {
  const { documentId } = props;
  let viewerDraftDocumentToDisplay = null;

  const caseDetail = get(state.caseDetail);

  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, cloneDeep(caseDetail));

  if (documentId) {
    viewerDraftDocumentToDisplay = draftDocuments.find(
      d => d.documentId === documentId,
    );
  } else {
    viewerDraftDocumentToDisplay = draftDocuments[0];
  }

  return {
    viewerDraftDocumentToDisplay,
  };
};
