import { state } from '@web-client/presenter/app.cerebral';

/**
 * default secondary document.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 */
export const defaultSecondaryDocumentAction = ({ get, store }: ActionProps) => {
  const primaryDocumentScenario = get(state.form.scenario);

  if (primaryDocumentScenario === 'Nonstandard H') {
    const secondaryDocument = get(state.form.secondaryDocument);

    if (!secondaryDocument) {
      store.set(state.form.secondaryDocument, {});
    } else {
      if (!secondaryDocument.attachments) {
        store.set(state.form.secondaryDocument.attachments, false);
      }
      if (!secondaryDocument.certificateOfService) {
        store.set(state.form.secondaryDocument.certificateOfService, false);
      }
    }
  } else {
    store.unset(state.form.secondaryDocument);
  }
};
