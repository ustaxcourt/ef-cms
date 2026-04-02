import { state } from '@web-client/presenter/app.cerebral';
/**
 * Fetches the case using the getCase use case using the props.docketNumber
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getCaseAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);

  if (!docketNumber) {
    throw new Error('Docket number is required to get case details');
  }

  const MAX_PAGE = 20;

  // Fetch the case metadata and the first page of docket entries in parallel
  const [caseDetail, firstPageResult] = await Promise.all([
    applicationContext.getUseCases().getCaseInteractor(applicationContext, {
      docketNumber,
    }),
    applicationContext
      .getUseCases()
      .getCaseDocketEntriesInteractor(applicationContext, {
        docketNumber,
        page: 0,
      }),
  ]);

  const allDocketEntries: any[] = [...firstPageResult.docketEntries];

  // If there are more pages, fetch them all in parallel
  const totalPages = Math.ceil(
    firstPageResult.totalCount / firstPageResult.pageSize,
  );
  const remainingPages = Math.min(totalPages, MAX_PAGE + 1);

  if (remainingPages > 1) {
    const pagePromises: Promise<any>[] = [];
    for (let page = 1; page < remainingPages; page++) {
      pagePromises.push(
        applicationContext
          .getUseCases()
          .getCaseDocketEntriesInteractor(applicationContext, {
            docketNumber,
            page,
          }),
      );
    }
    const results = await Promise.all(pagePromises);
    for (const result of results) {
      allDocketEntries.push(...result.docketEntries);
    }
  }

  caseDetail.docketEntries = allDocketEntries;

  return { caseDetail };
};
