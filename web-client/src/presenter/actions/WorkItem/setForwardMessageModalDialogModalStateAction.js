import { state } from 'cerebral';

/**
 * set the modal state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setForwardMessageModalDialogModalStateAction = ({
  get,
  store,
}) => {
  const messageDetail = get(state.messageDetail)[0]; //todo in later task
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: messageDetail.attachments,
    from: messageDetail.from,
    fromSection: messageDetail.fromSection,
    fromUserId: messageDetail.fromUserId,
    parentMessageId: messageDetail.parentMessageId,
    subject: messageDetail.subject,
  });
};
