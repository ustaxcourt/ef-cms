import { state } from 'cerebral';

/**
 * initiates the document to be served
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object containing the createObjectURL function
 * @returns {object} the user
 */
export const serveCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const caseDetail = get(state.caseDetail);
  const consolidatedCases = caseDetail.consolidatedCases || [];
  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumber);

  const isLeadCase = caseDetail.docketNumber === caseDetail.leadDocketNumber;

  const consolidatedCasesPropagateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCasesPropagateDocketEntries,
  );

  /*
  const currentDocketEntryCompatibleWithConsolidation =
    !eventCodesNotCompatibleWithConsolidation.includes(form.eventCode);
  */

  if (
    !isLeadCase ||
    !consolidatedCasesPropagateDocketEntriesFlag ||
    docketNumbers.length === 0 ||
    !currentDocketEntryCompatibleWithConsolidation
  ) {
    docketNumbers = [caseDetail.docketNumber];
  }

  const result = await applicationContext
    .getUseCases()
    .serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId,
      docketNumbers,
      subjectCaseDocketNumber: caseDetail.docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Document served. ',
    },
    pdfUrl: result?.pdfUrl,
  };
};
