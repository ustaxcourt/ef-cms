import { changePasswordLocalAction } from '../actions/changePasswordLocalAction';
import { gotoLoginSequence } from '@web-client/presenter/sequences/Login/goToLoginSequence';
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
      gotoLoginSequence,
    ],
  },
]);
