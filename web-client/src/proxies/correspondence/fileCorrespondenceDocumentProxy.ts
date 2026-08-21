import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const fileCorrespondenceDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata, primaryDocumentFileId },
): Promise<CaseDTO> => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${docketNumber}/correspondence`,
  });
};
