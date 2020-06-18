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
  const messageDetail = get(state.messageDetail);
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: messageDetail.attachments,
    subject: messageDetail.subject,
    to: messageDetail.from,
    toSection: messageDetail.fromSection,
    toUserId: messageDetail.fromUserId,
  });
};
