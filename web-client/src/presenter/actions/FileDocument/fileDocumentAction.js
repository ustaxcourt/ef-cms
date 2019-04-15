import { state } from 'cerebral';

/**
 * file the document
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing secondaryDocument
 * @param {Object} providers.get the cerebral get function
 */
export const fileDocumentAction = async ({
  store,
  get,
  applicationContext,
}) => {
  const form = get(state.form);
  await applicationContext.getUseCases().fileDocument({
    applicationContext,
    form,
  });
};
