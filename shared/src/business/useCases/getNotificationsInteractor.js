/**
 * getNotifications
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getNotifications = async ({ applicationContext }) => {
  const unreadMessages = await applicationContext
    .getPersistenceGateway()
    .getUnreadMessagesForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return { unreadCount: unreadMessages.length };
};
