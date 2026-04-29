import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const fileCourtIssuedDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumbers, documentMeta, subjectDocketNumber },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: {
      docketNumbers,
      documentMeta,
      subjectDocketNumber,
    },
    endpoint: `/case-documents/${subjectDocketNumber}/court-issued-docket-entry`,
  });
};
