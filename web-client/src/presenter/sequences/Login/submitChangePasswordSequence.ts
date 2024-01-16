import { clearFormAction } from '@web-client/presenter/actions/clearFormAction';
import { decodeTokenAction } from '@web-client/presenter/actions/decodeTokenAction';
import { getUserAction } from '@web-client/presenter/actions/getUserAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setTokenAction } from '@web-client/presenter/actions/Login/setTokenAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';
import { setUserPermissionsAction } from '@web-client/presenter/actions/setUserPermissionsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { submitChangePasswordAction } from '@web-client/presenter/actions/Login/submitChangePasswordAction';

export const submitChangePasswordSequence = [
  showProgressSequenceDecorator([
    submitChangePasswordAction,
    {
      error: [setAlertErrorAction],
      success: [
        clearFormAction,
        decodeTokenAction,
        setTokenAction,
        getUserAction,
        setUserAction,
        setUserPermissionsAction,
        navigateToPathAction,
      ],
    },
  ]),
] as unknown as () => void;
