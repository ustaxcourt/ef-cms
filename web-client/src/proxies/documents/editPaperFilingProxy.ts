import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const editPaperFilingInteractor = (
  applicationContext: ClientApplicationContext,
  {
    clientConnectionId,
    consolidatedGroupDocketNumbers,
    docketEntryId,
    documentMetadata,
    isSavingForLater,
  },
) => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      clientConnectionId,
      consolidatedGroupDocketNumbers,
      docketEntryId,
      documentMetadata,
      isSavingForLater,
    },
    endpoint: `/async/case-documents/${docketNumber}/paper-filing`,
  });
};
