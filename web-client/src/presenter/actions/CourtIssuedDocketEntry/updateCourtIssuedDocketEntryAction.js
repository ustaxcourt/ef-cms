import { state } from 'cerebral';

/**
 * updates a docket entry with the given court-issued document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const updateCourtIssuedDocketEntryAction = async ({
  applicationContext,
  get,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const docketNumber = get(state.caseDetail.docketNumber);
  const form = get(state.form);

  const documentMeta = {
    ...form,
    docketEntryId,
    docketNumber,
  };

  return await applicationContext
    .getUseCases()
    .updateCourtIssuedDocketEntryInteractor(applicationContext, {
      docketEntryId,
      documentMeta,
    });
};
