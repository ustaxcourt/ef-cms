import { state } from 'cerebral';

/**
 * updates the message form data's attachments field based on the document being QCd
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.store the cerebral store object
 */
export const updateMessageModalAfterQCAction = ({ get, store }) => {
  store.set(state.modal.validationErrors, {});

  const { documentTitle } = get(state.form);
  const documentId = get(state.docketEntryId);

  store.set(state.modal.form.subject, documentTitle);

  store.set(state.modal.form.attachments, [
    {
      documentId,
      documentTitle,
    },
  ]);
};
