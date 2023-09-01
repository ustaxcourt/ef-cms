import { state } from '@web-client/presenter/app.cerebral';

export const setReplyToMessageModalDialogModalStateAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
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
    draftAttachments: [],
    parentMessageId: mostRecentMessage.parentMessageId,
    subject: mostRecentMessage.subject,
    to: mostRecentMessage.from,
    toSection: mostRecentMessage.fromSection,
    toUserId: mostRecentMessage.fromUserId,
  });
};
