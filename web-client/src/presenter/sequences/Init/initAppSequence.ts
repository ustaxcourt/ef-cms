import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { parallel } from 'cerebral/factories';
import { refreshTokenAction } from '@web-client/presenter/actions/Login/refreshTokenAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { startRefreshIntervalSequence } from '@web-client/presenter/sequences/startRefreshIntervalSequence';

export const initAppSequence = [
  refreshTokenAction,
  setTokenAction,
  parallel([
    [getUserAction, setUserAction, setUserPermissionsAction],
    startRefreshIntervalSequence,
  ]),
] as unknown as () => void;
