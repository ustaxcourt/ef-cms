import { state } from 'cerebral';

/**
 * updates the current case message form data's attachments field
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const updateCreateCaseMessageAttachmentsAction = ({
  get,
  props,
  store,
}) => {
  const { documentId, documentTitle } = props;
  const { attachments } = get(state.modal.form);

  // TODO: Should we evaluate the length of the array and conditionally push?
  if (documentId) {
    attachments.push({
      documentId,
      documentTitle,
    });

    store.set(state.modal.form.attachments, attachments);
  }
};
