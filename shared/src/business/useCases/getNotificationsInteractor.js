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

  return {
    myInboxUnreadCount: inbox
      .filter(item => item.isInternal === true)
      .filter(item => !item.isRead).length,
    qcUnreadCount: inbox
      .filter(item => item.isInternal === false)
      .filter(item => !item.isRead).length,
  };
};
