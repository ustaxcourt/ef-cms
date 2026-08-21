import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const archiveCorrespondenceDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { correspondenceId, docketNumber },
): Promise<CaseDTO> => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/correspondence/${correspondenceId}`,
  });
};
