import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { hasUpdatedEmailAction } from '../actions/hasUpdatedEmailAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const adminContactUpdateInitialUpdateCompleteSequence = [
  unsetWaitingForResponseAction,
  hasUpdatedEmailAction,
  {
    no: [
      getUserContactEditCompleteAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToPractitionerDetailAction,
    ],
    yes: [setShowModalFactoryAction('EmailVerificationModal')],
  },
];
