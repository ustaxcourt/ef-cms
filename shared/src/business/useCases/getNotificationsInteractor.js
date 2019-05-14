/**
 * getNotifications
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getNotifications = async ({ applicationContext }) => {
  const inbox = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

  return { unreadCount: inbox.filter(item => !item.isRead).length };
};
