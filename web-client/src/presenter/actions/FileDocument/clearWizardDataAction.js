import { pick } from 'lodash';
import { state } from 'cerebral';

/**
 * Clears document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing scenario
 */
export const clearWizardDataAction = ({ store, get, props }) => {
  let pickedDocument;

  switch (props.key) {
    case 'category':
      pickedDocument = pick(get(state.form), ['category']);
      store.set(state.form, pickedDocument);

      break;
    case 'documentType':
      pickedDocument = pick(get(state.form), ['category', 'documentType']);
      store.set(state.form, pickedDocument);

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
