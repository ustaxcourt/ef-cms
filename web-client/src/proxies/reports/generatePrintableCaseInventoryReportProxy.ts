import { ClientApplicationContext } from '@web-client/applicationContext';
import { asyncSyncHandler, get } from '../requests';

export const generatePrintableCaseInventoryReportInteractor = (
  applicationContext: ClientApplicationContext,
  {
    associatedJudge,
    status,
  }: {
    associatedJudge?: string;
    status?: string;
  },
) => {
  return asyncSyncHandler(
    applicationContext,
    async asyncSyncId =>
      await get({
        applicationContext,
        asyncSyncId,
        endpoint: '/async/reports/printable-case-inventory-report',
        params: { associatedJudge, status },
      }),
  ) as Promise<{
    fileId: string;
    url: string;
  }>;
};
