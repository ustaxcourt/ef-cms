import { state } from '@web-client/presenter/app.cerebral';

/**
 * creates a docket entry with the given court-issued document
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitCourtIssuedDocketEntryAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const { COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET } =
    applicationContext.getConstants();

  const documentMeta = {
    ...get(state.form),
    docketEntryId,
  };

  await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      docketNumbers: [],
      documentMeta,
      subjectDocketNumber: docketNumber,
    });

  return {
    docketEntryId,
    generateCoversheet: COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      documentMeta.eventCode,
    ),
  };
};
