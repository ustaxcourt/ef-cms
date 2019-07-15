import { state } from 'cerebral';

/**
 * add supporting document to form for either primary or secondary doc
 * depending on props.type passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const addSupportingDocumentToFormAction = ({ props, store }) => {
  const { type } = props;

  if (type === 'primary') {
    store.set(state.form.hasSupportingDocuments, true);
  } else if (type === 'secondary') {
    store.set(state.form.hasSecondarySupportingDocuments, true);
  }
};
