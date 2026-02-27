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

  const caseDetail = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, {
      docketNumber,
    });

  // Fetch all docket entries via the paginated endpoint
  const MAX_PAGE = 20;
  const allDocketEntries: any[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore && page <= MAX_PAGE) {
    const result = await applicationContext
      .getUseCases()
      .getCaseDocketEntriesInteractor(applicationContext, {
        docketNumber,
        page,
      });

    allDocketEntries.push(...result.docketEntries);

    const fetched = (page + 1) * result.pageSize;
    hasMore = fetched < result.totalCount;
    page++;
  }

  caseDetail.docketEntries = allDocketEntries;

  return { caseDetail };
};
