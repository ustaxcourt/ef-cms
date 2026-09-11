import { exchangeAuthCodeAction } from '@web-client/presenter/actions/exchangeAuthCodeAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';

export const authCodeSequence = [
  exchangeAuthCodeAction,
  {
    success: [
      clearAuthStateAction,
      setTokenAction,
      getUserAction,
      setUserAction,
      setUserPermissionsAction,
      navigateToPathAction,
    ],
    error: [setAlertErrorAction, navigateToLoginAction],
  },
];
