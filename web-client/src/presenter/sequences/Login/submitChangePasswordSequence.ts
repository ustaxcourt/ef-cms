import { clearAlertsAction } from '@web-client/presenter/actions/clearAlertsAction';
import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToLoginAction } from '@web-client/presenter/actions/Login/navigateToLoginAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { setValidationErrorsAction } from '@web-client/presenter/actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { submitChangePasswordAction } from '@web-client/presenter/actions/Login/submitChangePasswordAction';
import { validateChangePasswordFormAction } from '@web-client/presenter/actions/Login/validateChangePasswordFormAction';

export const submitChangePasswordSequence = [
  showProgressSequenceDecorator([
    clearAlertsAction,
    validateChangePasswordFormAction,
    {
      error: [setValidationErrorsAction],
      success: [
        submitChangePasswordAction,
        {
          error: [setAlertErrorAction],
          success: [
            setTokenAction,
            getUserAction,
            setUserAction,
            setUserPermissionsAction,
            clearAuthStateAction,
            navigateToPathAction,
          ],
          unconfirmedAccount: [
            setAlertErrorAction,
            setSaveAlertsForNavigationAction,
            clearAuthStateAction,
            navigateToLoginAction,
          ],
        },
      ],
    },
  ]),
] as unknown as () => void;
