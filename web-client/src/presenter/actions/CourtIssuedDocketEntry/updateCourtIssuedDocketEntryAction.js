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
  const documentId = get(state.documentId);
  const caseId = get(state.caseDetail.caseId);
  const form = get(state.form);

  const documentMeta = {
    ...form,
    caseId,
    documentId,
  };

  return await applicationContext
    .getUseCases()
    .updateCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentId,
      documentMeta,
    });
};
