import { state } from 'cerebral';

export const getShouldSetAppTimeoutModalAction = ({
  applicationContext,
  get,
  path,
}) => {
  const appInstances = get(state.appInstances);
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
