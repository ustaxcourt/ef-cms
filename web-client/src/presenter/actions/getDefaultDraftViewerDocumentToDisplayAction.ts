import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the first draft document from the current case detail to set as the default viewerDocumentToDisplay
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDraftViewerDocumentToDisplayAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const draftDocketEntryId =
    get(state.draftDocumentViewerDocketEntryId) ||
    get(state.screenMetadata.draftDocumentViewerDocketEntryId);

  const caseDetail = get(state.caseDetail);
  const { draftDocuments } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, cloneDeep(caseDetail), user);

  let viewerDraftDocumentToDisplay = draftDocuments[0];

  if (draftDocketEntryId) {
    viewerDraftDocumentToDisplay = draftDocuments.find(
      d => d.docketEntryId === draftDocketEntryId,
    );
  }

  return {
    viewerDraftDocumentToDisplay,
  };
};
