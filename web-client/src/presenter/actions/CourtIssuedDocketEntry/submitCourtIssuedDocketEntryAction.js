import { state } from 'cerebral';

/**
 * creates a docket entry with the given court-issued document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitCourtIssuedDocketEntryAction = async ({
  applicationContext,
  get,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  const { COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET } =
    applicationContext.getConstants();

  const documentMeta = {
    ...form,
    docketEntryId,
    docketNumber,
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
        docketNumber,
      });
  }
};
