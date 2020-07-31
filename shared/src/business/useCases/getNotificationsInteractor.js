/**
 * getNotificationsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} inbox unread message counts for the individual and section inboxes
 */
exports.getNotificationsInteractor = async ({ applicationContext }) => {
  const documentQCInbox = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return {
    qcUnreadCount: documentQCInbox.filter(item => !item.isRead).length,
  };
};
