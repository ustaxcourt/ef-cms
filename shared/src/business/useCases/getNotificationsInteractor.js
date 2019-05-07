/**
 * getNotifications
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getNotifications = async ({ applicationContext }) => {
  const workItems = await applicationContext
    .getUseCases()
    .getWorkItemsForUser({ applicationContext });

  const unreadCount = workItems.filter(
    item => !item.isRead && !item.completedAt,
  ).length;

  return { unreadCount };
};
