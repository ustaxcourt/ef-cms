import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { decodeTokenAction } from '@web-client/presenter/actions/decodeTokenAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
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
          error: [setAlertErrorAction],
          success: [
            clearAuthStateAction,
            decodeTokenAction,
            setTokenAction,
            getUserAction,
            setUserAction,
            setUserPermissionsAction,
            navigateToPathAction,
          ],
        },
      ],
    },
  ]),
] as unknown as () => void;
