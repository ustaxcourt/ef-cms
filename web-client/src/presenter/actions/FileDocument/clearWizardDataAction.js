import { pick } from 'lodash';
import { state } from 'cerebral';

/**
 * Clears document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing scenario
 */
export const clearWizardDataAction = ({ get, props, store }) => {
  let pickedDocument;

  switch (props.key) {
    case 'category':
      pickedDocument = pick(get(state.form), ['category']);
      store.set(state.form, pickedDocument);

      break;
    case 'certificateOfService':
      store.set(state.form.certificateOfServiceDate, null);

      break;
    case 'documentType':
      pickedDocument = pick(get(state.form), ['category', 'documentType']);
      store.set(state.form, pickedDocument);

      break;
    case 'hasSupportingDocuments':
      store.set(state.form.supportingDocument, null);
      store.set(state.form.supportingDocumentFreeText, null);
      store.set(state.form.supportingDocumentFile, null);
      store.set(state.form.supportingDocumentMetadata, null);

      break;
    case 'supportingDocument':
      store.set(state.form.supportingDocumentFreeText, null);

      break;
    case 'secondaryDocumentFile':
      store.set(state.form.hasSecondarySupportingDocuments, false);
      store.set(state.form.secondarySupportingDocument, null);
      store.set(state.form.secondarySupportingDocumentFreeText, null);
      store.set(state.form.secondarySupportingDocumentFile, null);
      store.set(state.form.secondarySupportingDocumentMetadata, null);
      break;
    case 'hasSecondarySupportingDocuments':
      store.set(state.form.secondarySupportingDocument, null);
      store.set(state.form.secondarySupportingDocumentFreeText, null);
      store.set(state.form.secondarySupportingDocumentFile, null);
      store.set(state.form.secondarySupportingDocumentMetadata, null);

      break;
    case 'secondarySupportingDocument':
      store.set(state.form.secondarySupportingDocumentFreeText, null);

      break;
    case 'secondaryDocument.category':
      pickedDocument = pick(get(state.form.secondaryDocument), ['category']);
      store.set(state.form.secondaryDocument, pickedDocument);

      break;
    case 'secondaryDocument.documentType':
      pickedDocument = pick(get(state.form.secondaryDocument), [
        'category',
        'documentType',
      ]);
      store.set(state.form.secondaryDocument, pickedDocument);

      break;
  }
};
