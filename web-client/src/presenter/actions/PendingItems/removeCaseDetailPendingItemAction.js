/**
 * remove the pending item from the case detail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {object} providers.props the cerebral props object
 * @returns {object} the new props
 */
export const removeCaseDetailPendingItemAction = async ({
  applicationContext,
  props,
}) => {
  const {
    caseDetail: { docketNumber },
    docketEntryId,
  } = props;

  const caseDetail = await applicationContext
    .getUseCases()
    .removeCasePendingItemInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
  return { caseDetail };
};
