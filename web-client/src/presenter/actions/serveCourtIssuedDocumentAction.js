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
  const consolidatedCasesPropagateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCasesPropagateDocketEntries,
  );
  const docketEntryId = get(state.docketEntryId);
  const caseDetail = get(state.caseDetail);
  const {
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ENTERED_AND_SERVED_EVENT_CODES,
  } = applicationContext.getConstants();

  // ENTERED_AND_SERVED docs immediately close a case when served, and all COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET are unservable
  const eventCodesNotCompatibleWithConsolidation = [
    ...ENTERED_AND_SERVED_EVENT_CODES,
    ...COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  ];

  const docketEntry = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );
  const currentDocketEntryCompatibleWithConsolidation =
    !eventCodesNotCompatibleWithConsolidation.includes(docketEntry.eventCode);

  const consolidatedCases = caseDetail.consolidatedCases || [];
  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumber);

  const isLeadCase = caseDetail.docketNumber === caseDetail.leadDocketNumber;

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
