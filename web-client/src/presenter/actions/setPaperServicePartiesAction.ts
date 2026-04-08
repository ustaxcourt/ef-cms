import { state } from '@web-client/presenter/app.cerebral';

export const setPaperServicePartiesAction = ({ props, store }: ActionProps) => {
  if (
    props.pdfUrl &&
    props.paperServiceParties &&
    props.paperServiceParties.length > 0
  ) {
    store.set(state.modal.showModal, 'PaperServiceConfirmModal');
    store.set(state.form.documentTitle, props.paperServiceDocumentTitle);
    store.set(state.paperServiceParties, props.paperServiceParties);
  }
};
