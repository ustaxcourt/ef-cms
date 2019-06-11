import { state } from 'cerebral';

/**
 * file the document
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing secondaryDocument
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const fileDocumentAction = async ({ get, applicationContext }) => {
  const form = get(state.form);
  await applicationContext.getUseCases().fileDocument({
    applicationContext,
    form,
  });
};
