/**
 * fetch the public case detail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props the cerebral props object containing props.docketNumber
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getPublicCaseAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const MAX_PAGE = 20;

  const [caseDetail, firstPageResult] = await Promise.all([
    applicationContext.getUseCases().getCaseInteractor(applicationContext, {
      docketNumber: props.docketNumber,
    }),
    applicationContext
      .getUseCases()
      .getCaseDocketEntriesInteractor(applicationContext, {
        docketNumber: props.docketNumber,
        page: 0,
      }),
  ]);

  const allDocketEntries: any[] = [...firstPageResult.docketEntries];

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
            docketNumber: props.docketNumber,
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

  return {
    caseDetail,
  };
};
