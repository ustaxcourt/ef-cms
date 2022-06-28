import { state } from 'cerebral';

/**
 * File and serve a court issued document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @returns {Promise<*>} the success message after the document has been filed and served
 */
export const fileAndServeCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const {
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ENTERED_AND_SERVED_EVENT_CODES,
  } = applicationContext.getConstants();

  const eventCodesNotCompatibleWithConsolidation = [
    ...ENTERED_AND_SERVED_EVENT_CODES,
    ...COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  ];

  const currentDocketEntryCompatibleWithConsolidation =
    !eventCodesNotCompatibleWithConsolidation.includes(form.eventCode);

  const isLeadCase = caseDetail.docketNumber === caseDetail.leadDocketNumber;

  const consolidatedCases = get(state.caseDetail.consolidatedCases) || [];

  const consolidatedCasesPropagateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCasesPropagateDocketEntries,
  );

  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumber);

  if (
    !isLeadCase ||
    !consolidatedCasesPropagateDocketEntriesFlag ||
    docketNumbers.length === 0 ||
    !currentDocketEntryCompatibleWithConsolidation
  ) {
    docketNumbers = [caseDetail.docketNumber];
  }

  const tabId = get(state.tabId);

  await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId,
      docketNumbers,
      form,
      subjectCaseDocketNumber: caseDetail.docketNumber,
      tabId,
    });
};
