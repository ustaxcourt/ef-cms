import { state } from 'cerebral';

/**
 * TODO FIXME Calculates penalties from the current calculate penalties modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {number} total computed value from penalty values
 */
export const broadcastIdleStatusAction = async ({ get, props }) => {
  const idleStatus = get(state.idleStatus);
  const { channelHandle } = props;
  await channelHandle.postMessage({ idleStatus, topic: 'idleStatusResponse' });
};
