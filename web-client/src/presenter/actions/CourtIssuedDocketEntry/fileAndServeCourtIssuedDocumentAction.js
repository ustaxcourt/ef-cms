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

  const consolidatedCases =
    get(state.formattedCaseDetail.consolidatedCases) || [];
  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .map(consolidatedCase => consolidatedCase.docketNumber);

  if (
    !isLeadCase ||
    docketNumbers.length === 0 ||
    !currentDocketEntryCompatibleWithConsolidation
  ) {
    docketNumbers = [caseDetail.docketNumber];
  }

  const documentMeta = {
    ...form,
    docketEntryId,
    docketNumbers,
    leadCaseDocketNumber: caseDetail.docketNumber,
  };

  const result = await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta,
    });

  return {
    alertSuccess: {
      message: 'Document served. ',
    },
    pdfUrl: result ? result.pdfUrl : undefined,
  };
};
