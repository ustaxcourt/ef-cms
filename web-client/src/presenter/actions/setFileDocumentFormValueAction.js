import { state } from 'cerebral';

/**
 * sets the state.form[props.key] to the props.value passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setFileDocumentFormValueAction = ({ get, props, store }) => {
  if (
    ['previousDocument', 'secondaryDocument.previousDocument'].includes(
      props.key,
    )
  ) {
    const caseDetail = get(state.caseDetail);

    const previousDocument = caseDetail.documents.find(
      document => document.documentId === props.value,
    );
    store.set(state.form[props.key], previousDocument);
  } else {
    if (props.value !== '') {
      store.set(state.form[props.key], props.value);
    } else {
      store.unset(state.form[props.key]);
    }
  }
};
