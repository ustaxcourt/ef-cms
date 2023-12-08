import { changePasswordLocalAction } from '../actions/changePasswordLocalAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const changePasswordLocalSequence = showProgressSequenceDecorator([
  changePasswordLocalAction,
  {
    no: [],
    yes: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToLoginSequence,
    ],
  },
]);
