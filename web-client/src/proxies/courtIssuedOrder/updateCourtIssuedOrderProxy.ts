import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const updateCourtIssuedOrderInteractor = (
  applicationContext: ClientApplicationContext,
  { docketEntryIdToEdit, documentMetadata },
): Promise<CaseDTO> => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-orders/${docketEntryIdToEdit}`,
  });
};
