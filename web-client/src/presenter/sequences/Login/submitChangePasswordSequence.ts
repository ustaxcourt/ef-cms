import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToForgotPasswordAction } from '@web-client/presenter/actions/Login/navigateToForgotPasswordAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { submitChangePasswordAction } from '@web-client/presenter/actions/Login/submitChangePasswordAction';
import { validateChangePasswordFormAction } from '@web-client/presenter/actions/Login/validateChangePasswordFormAction';

export const submitChangePasswordSequence = [
  showProgressSequenceDecorator([
    validateChangePasswordFormAction,
    {
      error: [setValidationAlertErrorsAction],
      success: [
        submitChangePasswordAction,
        {
          codeExpired: [
            setAlertErrorAction,
            setSaveAlertsForNavigationAction,
            navigateToForgotPasswordAction,
          ],
          error: [setAlertErrorAction],
          success: [
            clearAuthStateAction,
            setTokenAction,
            getUserAction,
            setUserAction,
            setUserPermissionsAction,
            navigateToPathAction,
          ],
          unconfirmedAccount: [
            setAlertErrorAction,
            setSaveAlertsForNavigationAction,
            navigateToLoginAction,
          ],
        },
      ],
    },
  ]),
] as unknown as () => void;
