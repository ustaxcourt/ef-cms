import { state } from 'cerebral';

/**
 * set the modal state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setForwardMessageModalDialogModalStateAction = ({
  props,
  store,
}) => {
  const { mostRecentMessage } = props;
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: mostRecentMessage.attachments,
    from: mostRecentMessage.from,
    fromSection: mostRecentMessage.fromSection,
    fromUserId: mostRecentMessage.fromUserId,
    parentMessageId: mostRecentMessage.parentMessageId,
    subject: mostRecentMessage.subject,
  });
};
