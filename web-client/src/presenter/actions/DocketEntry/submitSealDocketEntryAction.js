import { state } from 'cerebral';

/**
 * calls interactor to seal a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitSealDocketEntryAction = async ({
  applicationContext,
  get,
}) => {
  const { docketEntryId, docketEntrySealedTo } = get(state.modal);
  const { docketNumber } = get(state.caseDetail);

  await applicationContext
    .getUseCases()
    .sealDocketEntryInteractor(applicationContext, {
      docketEntryId,
      docketEntrySealedTo,
      docketNumber,
    });
};
