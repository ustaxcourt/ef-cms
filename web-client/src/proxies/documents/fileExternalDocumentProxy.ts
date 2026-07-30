import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';

export const fileExternalDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata },
): Promise<CaseDTO | RestrictedCaseResponse | PublicCaseResponse> => {
  const { docketNumber } = documentMetadata;
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await post({
        applicationContext,
        asyncSyncId,
        body: {
          documentMetadata,
        },
        endpoint: `/async/case-documents/${docketNumber}/external-document`,
      }),
  ) as Promise<CaseDTO | RestrictedCaseResponse | PublicCaseResponse>;
};
