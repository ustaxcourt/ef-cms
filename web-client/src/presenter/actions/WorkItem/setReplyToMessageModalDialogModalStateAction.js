import { state } from 'cerebral';

/**
 * set the modal state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setReplyToMessageModalDialogModalStateAction = ({
  props,
  store,
}) => {
  const { mostRecentMessage } = props;
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: mostRecentMessage.attachments,
    parentMessageId: mostRecentMessage.parentMessageId,
    subject: mostRecentMessage.subject,
    to: mostRecentMessage.from,
    toSection: mostRecentMessage.fromSection,
    toUserId: mostRecentMessage.fromUserId,
  });
};
