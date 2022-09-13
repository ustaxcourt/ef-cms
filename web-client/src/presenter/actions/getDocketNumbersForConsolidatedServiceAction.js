import { state } from 'cerebral';

/**
 * gets docket numbers of all checked consolidated cases for shared docket entry service
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the user
 */
export const getDocketNumbersForConsolidatedServiceAction = async ({
  applicationContext,
  get,
}) => {
  const consolidatedCasesPropagateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCasesPropagateDocketEntries,
  );
  const caseDetail = get(state.caseDetail);
  const consolidatedCases = caseDetail.consolidatedCases || [];
  const docketEntryId = get(state.docketEntryId);
  const {
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ENTERED_AND_SERVED_EVENT_CODES,
    SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  } = applicationContext.getConstants();
  const isLeadCase = caseDetail.docketNumber === caseDetail.leadDocketNumber;
  const eventCodesNotCompatibleWithConsolidation = [
    ...ENTERED_AND_SERVED_EVENT_CODES,
    ...COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ...SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  ];
  const docketEntry = caseDetail.docketEntries.find(
    entry => entry.docketEntryId === docketEntryId,
  );
  const currentDocketEntryCompatibleWithConsolidation =
    !eventCodesNotCompatibleWithConsolidation.includes(docketEntry.eventCode);

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

  return { docketNumbers };
};
