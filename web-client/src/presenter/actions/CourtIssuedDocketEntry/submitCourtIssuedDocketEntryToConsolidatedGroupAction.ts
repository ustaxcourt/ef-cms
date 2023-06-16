import { state } from '@web-client/presenter/app.cerebral';

/**
 * saves the court issued docket entry on all of the checked consolidated cases of the group.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCourtIssuedDocketEntryToConsolidatedGroupAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { docketNumbers } = props;
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
      docketNumbers,
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
