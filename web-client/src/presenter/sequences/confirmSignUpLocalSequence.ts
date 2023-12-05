import { confirmSignUpLocalAction } from '../actions/confirmSignUpLocalAction';
import { navigateToCognitoAction } from '@web-client/presenter/actions/navigateToCognitoAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { sleep } from '@shared/tools/helpers';

export const confirmSignUpLocalSequence = [
  confirmSignUpLocalAction,
  {
    no: [
      setAlertErrorAction,
      setSaveAlertsForNavigationAction,
      navigateToCognitoAction,
    ],
    yes: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      async () => {
        await sleep(3000);
      },
      navigateToCognitoAction,
    ],
  },
];
