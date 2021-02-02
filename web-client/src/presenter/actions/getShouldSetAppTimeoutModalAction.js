/**
 * examines all app instances and determines whether to display the AppTimeoutModal
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} path the cerebral path object
 * @returns {promise} the next path in the sequence
 */
export const getShouldSetAppTimeoutModalAction = async ({
  applicationContext,
  path,
}) => {
  // TODO 7501 - refactor so we call one explicit method for fetching statuses
  const messageId = await applicationContext
    .getBroadcastGateway()
    .sendMessage({ subject: 'idleStatus' });

  const statuses = await applicationContext
    .getBroadcastGateway()
    .getMessages({ threadId: messageId });

  const allInstancesIdle = statuses.every(
    status =>
      status.idleStatus === applicationContext.getConstants().IDLE_STATUS.IDLE,
  );

  if (allInstancesIdle) {
    return path.yes();
  } else {
    return path.no();
  }
};
