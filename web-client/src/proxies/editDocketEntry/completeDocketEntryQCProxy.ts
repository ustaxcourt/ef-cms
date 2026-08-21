import { asyncSyncHandler, put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const completeDocketEntryQCInteractor = (
  applicationContext: ClientApplicationContext,
  { entryMetadata },
): Promise<{
  caseDetail: CaseDTO;
  paperServiceParties: any[];
  paperServicePdfUrl: string;
  paperServiceDocumentTitle: string;
}> => {
  const { docketNumber } = entryMetadata;
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await put({
        applicationContext,
        asyncSyncId,
        body: {
          entryMetadata,
        },
        endpoint: `/async/case-documents/${docketNumber}/docket-entry-complete`,
      }),
  ) as Promise<{
  caseDetail: CaseDTO;
  paperServiceParties: any[];
  paperServicePdfUrl: string;
  paperServiceDocumentTitle: string;
}>;
};
