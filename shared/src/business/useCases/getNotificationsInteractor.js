/**
 * getNotifications
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getNotifications = async ({ applicationContext }) => {
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
