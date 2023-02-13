import { state } from 'cerebral';

/**
 * set the modal state
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setReplyToMessageModalDialogModalStateAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { mostRecentMessage } = props;
  store.set(state.modal.validationErrors, {});

  const caseDetail = get(state.caseDetail);
  const formattedAttachments = applicationContext
    .getUtilities()
    .formatAttachments({
      applicationContext,
      attachments: mostRecentMessage.attachments,
      caseDetail,
    });

  store.set(state.modal.form, {
    attachments: formattedAttachments,
    parentMessageId: mostRecentMessage.parentMessageId,
    subject: mostRecentMessage.subject,
    to: mostRecentMessage.from,
    toSection: mostRecentMessage.fromSection,
    toUserId: mostRecentMessage.fromUserId,
  });
};
