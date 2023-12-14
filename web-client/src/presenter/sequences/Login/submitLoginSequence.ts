import { decodeTokenAction } from '@web-client/presenter/actions/decodeTokenAction';
import { getMaintenanceModeAction } from '@web-client/presenter/actions/getMaintenanceModeAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToMaintenanceAction } from '@web-client/presenter/actions/navigateToMaintenanceAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setTokenAction } from '@web-client/presenter/actions/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { state } from '@web-client/presenter/app-public.cerebral';

export const submitLoginSequence = [
  async ({ applicationContext, get }) => {
    const { email, password } = get(state.form);
    const { accessToken, idToken, refreshToken } = await applicationContext
      .getUseCases()
      .logInInteractor(applicationContext, { email, password });
    return {
      accessToken,
      idToken,
      refreshToken,
    };
  },
  decodeTokenAction,
  setTokenAction,
  getMaintenanceModeAction,
  {
    maintenanceOff: [
      getUserAction,
      setUserAction,
      setUserPermissionsAction,
      navigateToPathAction,
    ],
    maintenanceOn: [navigateToMaintenanceAction],
  },
] as unknown as (props) => void;
