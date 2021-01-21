import { state } from 'cerebral';

/**
 * updates the current message form data's attachments field for the complete and send message flow
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const updateMessageModalAttachmentsForCompleteAndSendAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { attachments } = get(state.modal.form);
  const docketEntry = get(state.form);
  const documentId = props.documentId || get(state.docketEntryId);

  const generatedDocumentTitle = applicationContext
    .getUtilities()
    .getDocumentTitleWithAdditionalInfo({ docketEntry });

  store.set(state.modal.form.subject, generatedDocumentTitle);

  attachments.push({
    documentId,
    documentTitle: generatedDocumentTitle,
  });

  store.set(state.modal.form.attachments, attachments);
};
