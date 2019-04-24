export const workQueueClickedAction = async ({
  applicationContext,
  router,
  props,
}) => {
  await applicationContext.getUseCases().setMessageAsRead({
    applicationContext,
    messageId: props.messageId,
  });

  await router.route(
    `/case-detail/${props.docketNumber}/documents/${props.documentId}`,
  );
};
