export const workQueueClickedAction = async ({
  applicationContext,
  router,
  props,
}) => {
  await applicationContext.getUseCases().setMessageAsRead({
    applicationContext,
    messageId: props.messageId,
  });

  let path = `/case-detail/${props.docketNumber}/documents/${props.documentId}`;
  if (props.messageId) {
    path = `${path}/message/${props.messageId}`;
  }
  await router.route(path);
};
