import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const saveSignedDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    nameForSigning,
    originalDocketEntryId,
    parentMessageId,
    signedDocumentStorageId,
  },
): Promise<{ caseEntity: CaseDTO; signedDocketEntryId: string }> => {
  return post({
    applicationContext,
    body: {
      nameForSigning,
      parentMessageId,
      signedDocumentStorageId,
    },
    endpoint: `/case-documents/${docketNumber}/${originalDocketEntryId}/sign`,
  });
};
