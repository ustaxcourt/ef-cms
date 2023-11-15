import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const paperDocketEntryHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const allCaseDocuments = [
    ...caseDetail.docketEntries,
    ...caseDetail.correspondence,
  ];

  const doc = allCaseDocuments.find(
    item => item.docketEntryId === docketEntryId,
  );
  const docketEntryHasDocument = !!(doc && doc.isFileAttached);
  const showAddDocumentWarning =
    isEditingDocketEntry &&
    !docketEntryHasDocument &&
    documentUploadMode === 'preview';

  return {
    canAllowDocumentServiceForCase,
    showAddDocumentWarning,
  };
};
