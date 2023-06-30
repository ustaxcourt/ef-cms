import { pick } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Clears document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing scenario
 */
export const clearWizardDataAction = ({ get, props, store }: ActionProps) => {
  let pickedDocument;

  switch (props.key) {
    case 'category':
      pickedDocument = pick(get(state.form), ['category', 'selectedCases']);
      store.set(state.form, pickedDocument);

      break;
    case 'certificateOfService':
      store.unset(state.form.certificateOfServiceDate);

      break;
    case 'documentType':
      pickedDocument = pick(get(state.form), [
        'category',
        'documentType',
        'selectedCases',
      ]);
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
