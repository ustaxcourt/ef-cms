import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const archiveDraftDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}`,
  });
};
