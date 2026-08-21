import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const removePdfFromDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryId, docketNumber },
): Promise<CaseDTO | void> => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/remove-pdf`,
  });
};
