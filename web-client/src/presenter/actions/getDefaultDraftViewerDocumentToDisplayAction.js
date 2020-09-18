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
  const docketEntryId =
    get(state.draftDocumentViewerDocketEntryId) || props.docketEntryId;

  let viewerDraftDocumentToDisplay = null;
  const caseDetail = get(state.caseDetail);

  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, cloneDeep(caseDetail));

  if (docketEntryId) {
    viewerDraftDocumentToDisplay = draftDocuments.find(
      d => d.docketEntryId === docketEntryId,
    );
  } else {
    viewerDraftDocumentToDisplay = draftDocuments[0];
  }

  return {
    viewerDraftDocumentToDisplay,
  };
};
