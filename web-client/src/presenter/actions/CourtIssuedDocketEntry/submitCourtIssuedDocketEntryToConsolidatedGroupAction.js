import { state } from 'cerebral';

export const submitCourtIssuedDocketEntryActionHelper = async ({
  applicationContext,
  get,
  getDocketNumbers,
  subjectDocketNumber,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const form = get(state.form);
  const docketNumbers = getDocketNumbers();

  const { COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET } =
    applicationContext.getConstants();

  const documentMeta = {
    ...form,
    docketEntryId,
    docketNumbers,
    subjectDocketNumber,
  };

  await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      docketEntryId,
      documentMeta,
    });

  if (
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      documentMeta.eventCode,
    )
  ) {
    await applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId,
        docketNumber: subjectDocketNumber,
      });
  }
};

/**
 * creates a docket entry with the given court-issued document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitCourtIssuedDocketEntryToConsolidatedGroupAction = async ({
  applicationContext,
  get,
}) => {
  await submitCourtIssuedDocketEntryActionHelper({
    applicationContext,
    get,
    getDocketNumbers: () => {
      const consolidatedCases = get(state.caseDetail.consolidatedCases) || [];
      return consolidatedCases
        .filter(consolidatedCase => consolidatedCase.checked)
        .map(consolidatedCase => consolidatedCase.docketNumber);
    },
    subjectDocketNumber: get(state.caseDetail.docketNumber),
  });
};
