import { changePasswordLocalAction } from '../actions/changePasswordLocalAction';
import { gotoLoginSequence } from './gotoLoginSequence';
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
