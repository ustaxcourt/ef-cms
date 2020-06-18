import { state } from 'cerebral';

/**
 * set the modal state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store function
 */
export const setReplyToMessageModalDialogModalStateAction = ({
  get,
  store,
}) => {
  const messageDetail = get(state.messageDetail)[0]; //todo in later task
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: messageDetail.attachments,
    parentMessageId: messageDetail.parentMessageId,
    subject: messageDetail.subject,
    to: messageDetail.from,
    toSection: messageDetail.fromSection,
    toUserId: messageDetail.fromUserId,
  });
};
