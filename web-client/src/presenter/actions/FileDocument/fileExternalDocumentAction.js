import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const fileExternalDocumentAction = async ({
  get,
  applicationContext,
}) => {
  const documentMetadata = get(state.form);

  const {
    primaryDocumentFile,
    secondaryDocumentFile,
    supportingDocumentFile,
    secondarySupportingDocumentFile,
  } = get(state.form);

  await applicationContext.getUseCases().fileExternalDocument({
    applicationContext,
    documentMetadata,
    primaryDocumentFile,
    secondaryDocumentFile,
    secondarySupportingDocumentFile,
    supportingDocumentFile,
  });
};
