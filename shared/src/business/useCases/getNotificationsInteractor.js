/**
 * getNotificationsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} inbox unread message counts for the individual and section inboxes
 */
exports.getNotificationsInteractor = async ({ applicationContext }) => {
  const messagesInbox = await applicationContext
    .getPersistenceGateway()
    .getInboxMessagesForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  const documentQCInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return {
    myInboxUnreadCount: messagesInbox.filter(item => !item.isRead).length,
    qcUnreadCount: documentQCInbox.filter(item => !item.isRead).length,
  };
};
