import { state } from 'cerebral';

export const getShouldSetAppTimeoutModalAction = ({
  applicationContext,
  get,
  path,
}) => {
  const messageId = applicationContext.getIPCGateway().sendMessage({topic: 'ping'});
  const appInstances = get(state.appInstances); // post message on broadcast channel?
  const statuses = await getAllStatuses();
  const allInstancesIdle = appInstances.every(
    appInstance =>
      appInstance.idleStatus ===
      applicationContext.getConstants().IDLE_STATUS.IDLE,
  );
  if (allInstancesIdle) {
    return path.yes();
  } else {
    return path.no();
  }
};
