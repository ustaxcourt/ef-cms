import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';
import { DOCKET_ENTRIES_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { getResponse } from './requests';

export const getCaseInteractor = async (
  applicationContext,
  { docketNumber },
): Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO> => {
  const pageSize = DOCKET_ENTRIES_PAGE_SIZE;

  const [caseResponse, firstPageResponse] = await Promise.all([
    getResponse({
      applicationContext,
      asyncSyncId: undefined,
      endpoint: `/cases/${docketNumber}`,
      params: { excludeDocketEntries: 'true' },
    }),
    getResponse({
      applicationContext,
      asyncSyncId: undefined,
      endpoint: `/cases/${docketNumber}/docket-entries`,
      params: { page: 0, pageSize },
    }),
  ]);

  const caseData = caseResponse.data;
  const firstPage = firstPageResponse.data;

  let allDocketEntries = [...firstPage.docketEntries];
  const allArchivedDocketEntries = [...(firstPage.archivedDocketEntries || [])];

  if (firstPage.totalCount > pageSize) {
    const totalPages = Math.ceil(firstPage.totalCount / pageSize);
    const remainingPagePromises: Promise<any>[] = [];

    for (let page = 1; page < totalPages; page++) {
      remainingPagePromises.push(
        getResponse({
          applicationContext,
          asyncSyncId: undefined,
          endpoint: `/cases/${docketNumber}/docket-entries`,
          params: { page, pageSize },
        }).then(response => response.data),
      );
    }

    const remainingPages = await Promise.all(remainingPagePromises);

    for (const pageData of remainingPages) {
      allDocketEntries = allDocketEntries.concat(pageData.docketEntries);
    }
  }

  return {
    ...caseData,
    archivedDocketEntries: allArchivedDocketEntries,
    docketEntries: allDocketEntries,
    hasPendingItems: firstPage.hasPendingItems,
  };
};
