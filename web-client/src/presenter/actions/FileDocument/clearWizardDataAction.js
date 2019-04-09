import { pick } from 'lodash';
import { state } from 'cerebral';

/**
 * Clears document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing scenario
 */
export const clearWizardDataAction = ({ store, get, props }) => {
  let document, secondaryDocument;
  console.log(get(state.form));

  switch (props.key) {
    case 'category':
      document = pick(get(state.form), ['category']);
      store.set(state.form, document);

      break;
    case 'documentType':
      document = pick(get(state.form), ['category', 'documentType']);
      console.log('document', document);
      store.set(state.form, document);

      break;
    case 'secondaryDocument.category':
      secondaryDocument = pick(get(state.form.secondaryDocument), ['category']);
      store.set(state.form.secondaryDocument, secondaryDocument);

      break;
    case 'secondaryDocument.documentType':
      secondaryDocument = pick(get(state.form.secondaryDocument), [
        'category',
        'documentType',
      ]);
      store.set(state.form.secondaryDocument, secondaryDocument);

      break;
  }
};
