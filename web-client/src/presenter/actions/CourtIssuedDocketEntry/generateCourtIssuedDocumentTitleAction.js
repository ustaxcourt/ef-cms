import { state } from 'cerebral';

/**
 * generate document titles for filing documents
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const generateCourtIssuedDocumentTitleAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const documentMetadata = get(state.form);
  const { computedDate, judgeWithTitle } = props;
  documentMetadata.date = computedDate;
  documentMetadata.judgeWithTitle = judgeWithTitle;

  let documentTitle = applicationContext
    .getUseCases()
    .generateCourtIssuedDocumentTitleInteractor({
      documentMetadata,
    });

  if (documentTitle) {
    store.set(state.form.generatedDocumentTitle, documentTitle);
  } else {
    store.unset(state.form.generatedDocumentTitle, documentTitle);
  }
};
