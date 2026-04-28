import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseInventoryReportInteractor = (
  applicationContext: ClientApplicationContext,
  { associatedJudge, selectedPage = 0, status },
): Promise<{ foundCases: RawCase[]; totalCount: number }> => {
  const { CASE_INVENTORY_PAGE_SIZE } = applicationContext.getConstants();

  return get({
    applicationContext,
    endpoint: '/reports/case-inventory-report',
    params: {
      associatedJudge,
      selectedPage,
      pageSize: CASE_INVENTORY_PAGE_SIZE,
      status,
    },
  });
};
