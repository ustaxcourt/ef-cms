import { state } from 'cerebral';

/**
 * updates the current case message form data's attachments field
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const updateCaseMessageModalAttachmentsAction = ({
  get,
  props,
  store,
}) => {
  const { attachments } = get(state.modal.form);
  const { documents } = get(state.caseDetail);
  const documentId = props.documentId || get(state.documentId);

  // TODO: Should we evaluate the length of the array and conditionally push?
  if (documentId) {
    const document = documents.find(d => d.documentId === documentId);

    const documentTitle = document.documentTitle || document.documentType;

    if (attachments.length === 0) {
      // This is the first attachment, so we should update the subject
      store.set(state.modal.form.subject, documentTitle);
    }

    attachments.push({
      documentId,
      documentTitle,
    });

    store.set(state.modal.form.attachments, attachments);
  }
};
