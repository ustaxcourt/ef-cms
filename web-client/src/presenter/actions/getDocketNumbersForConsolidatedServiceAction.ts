import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets docket numbers of all checked consolidated cases for shared docket entry service
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the list of docketNumbers
 */
export const getDocketNumbersForConsolidatedServiceAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const {
    NON_MULTI_DOCKETABLE_EVENT_CODES,
    SIMULTANEOUS_DOCUMENT_EVENT_CODES,
  } = applicationContext.getConstants();
  const { isLeadCase } = applicationContext.getUtilities();
  let { eventCode } = get(state.form);

  let eventCodeFromCaseDetail;
  if (!eventCode) {
    eventCodeFromCaseDetail = get(state.formattedCaseDetail).docketEntries.find(
      doc => doc.docketEntryId === get(state.docketEntryId),
    ).eventCode;
  }

  let consolidatedCases;
  let docketNumbers = [];
  if (SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(eventCodeFromCaseDetail)) {
    consolidatedCases = get(state.caseDetail.consolidatedCases) || [];
    docketNumbers = consolidatedCases.map(
      consolidatedCase => consolidatedCase.docketNumber,
    );
  } else {
    consolidatedCases =
      get(state.modal.form.consolidatedCasesToMultiDocketOn) || [];

    docketNumbers = consolidatedCases
      .filter(consolidatedCase => consolidatedCase.checked)
      .filter(consolidatedCase => !isLeadCase(consolidatedCase))
      .map(consolidatedCase => consolidatedCase.docketNumber);

    const caseDetail = get(state.caseDetail);
    if (
      !isLeadCase(caseDetail) ||
      NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode)
    ) {
      docketNumbers = [];
    }
  }

  return { docketNumbers };
};
