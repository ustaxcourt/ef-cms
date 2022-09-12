import { state } from 'cerebral';

/**
 * serves a paper filed document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} props needed for later actions
 */
export const servePaperFiledDocumentAction = async ({
  applicationContext,
  get,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntryId = get(state.docketEntryId);

  const caseDetail = get(state.caseDetail);
  const consolidatedCasesPropagateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCasesPropagateDocketEntries,
  );

  const consolidatedCases = get(state.caseDetail.consolidatedCases) || [];
  const isLeadCase = caseDetail.docketNumber === caseDetail.leadDocketNumber;

  let consolidatedGroupDocketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumber);

  if (
    !isLeadCase ||
    !consolidatedCasesPropagateDocketEntriesFlag ||
    consolidatedGroupDocketNumbers.length === 0
  ) {
    consolidatedGroupDocketNumbers = [caseDetail.docketNumber];
  }

  const { pdfUrl } = await applicationContext
    .getUseCases()
    .serveExternallyFiledDocumentInteractor(applicationContext, {
      consolidatedGroupDocketNumbers,
      docketEntryId,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Document served.',
    },
    hasPaper: !!pdfUrl,
    pdfUrl,
  };
};
