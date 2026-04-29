import { asyncSyncHandler, post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';

export const fileExternalDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { documentMetadata },
): Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO> => {
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
  ) as Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO>;
};
