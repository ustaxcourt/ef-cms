import { getUserContactEditCompleteAlertSuccessAction } from '../actions/getUserContactEditCompleteAlertSuccessAction';
import { hasUpdatedEmailFactoryAction } from '../actions/hasUpdatedEmailFactoryAction';
import { navigateToPractitionerDetailAction } from '../actions/navigateToPractitionerDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const adminContactUpdateInitialUpdateCompleteSequence = [
  unsetWaitingForResponseAction,
  hasUpdatedEmailFactoryAction('updatedEmail'),
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
