import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const removeSignatureFromDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/remove-signature`,
  });
};
