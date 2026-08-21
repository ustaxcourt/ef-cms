import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getDefaultDraftViewerDocumentToDisplayAction = ({
  applicationContext,
  get,
}: ActionProps): { viewerDraftDocumentToDisplay: RawDocketEntry } => {
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
    const foundDocument = draftDocuments.find(
      d => d.docketEntryId === draftDocketEntryId,
    );
    if (foundDocument) {
      viewerDraftDocumentToDisplay = foundDocument;
    }
  }

  return {
    viewerDraftDocumentToDisplay,
  };
};
