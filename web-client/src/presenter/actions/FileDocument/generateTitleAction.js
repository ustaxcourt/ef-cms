import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const generateTitleAction = ({ store, get, applicationContext }) => {
  const documentMetadata = get(state.form);

  const documentTitle = applicationContext.getUseCases().generateDocumentTitle({
    applicationContext,
    documentMetadata,
  });

  store.set(state.form.documentTitle, documentTitle);
};
