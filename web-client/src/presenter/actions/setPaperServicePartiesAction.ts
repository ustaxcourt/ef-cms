import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.showModal to display the PaperServiceConfirmModal if there are paperServiceParties on the props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setPaperServicePartiesAction = ({ props, store }: ActionProps) => {
  if (
    props.pdfUrl &&
    props.paperServiceParties &&
    props.paperServiceParties.length > 0
  ) {
    store.set(state.modal.showModal, 'PaperServiceConfirmModal');
    store.set(state.form.documentTitle, props.paperServiceDocumentTitle);
  }
};
