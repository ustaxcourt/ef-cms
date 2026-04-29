import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateCorrespondenceDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { correspondenceId, documentMetadata },
): Promise<CaseDTO> => {
  const { docketNumber } = documentMetadata;

  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/correspondence/${correspondenceId}`,
  });
};
