import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateCourtIssuedDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMeta },
): Promise<CaseDTO> => {
  const { docketNumber } = documentMeta;
  return put({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-docket-entry`,
  });
};
