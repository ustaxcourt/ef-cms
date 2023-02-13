import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getEligibleCasesForTrialSessionAction } from '../actions/TrialSession/getEligibleCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { mergeCaseOrderIntoCalendaredCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoCalendaredCasesAction';
import { mergeCaseOrderIntoEligibleCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoEligibleCasesAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultTrialSessionDetailTabAction } from '../actions/TrialSession/setDefaultTrialSessionDetailTabAction';
import { setEligibleCasesOnTrialSessionAction } from '../actions/TrialSession/setEligibleCasesOnTrialSessionAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../actions/TrialSession/setTrialSessionIdAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoTrialSessionDetails = startWebSocketConnectionSequenceDecorator([
  setCurrentPageAction('Interstitial'),
  setDefaultTrialSessionDetailTabAction,
  clearErrorAlertsAction,
  setTrialSessionIdAction,
  parallel([
    [
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
      isTrialSessionCalendaredAction,
      {
        no: [
          getEligibleCasesForTrialSessionAction,
          setEligibleCasesOnTrialSessionAction,
          mergeCaseOrderIntoEligibleCasesAction,
        ],
        yes: [
          getCalendaredCasesForTrialSessionAction,
          setCalendaredCasesOnTrialSessionAction,
          mergeCaseOrderIntoCalendaredCasesAction,
        ],
      },
    ],
    [getUsersInSectionAction({}), setUsersByKeyAction('sectionUsers')],
  ]),
  setCurrentPageAction('TrialSessionDetail'),
]);

export const gotoTrialSessionDetailSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionDetails,
    unauthorized: [redirectToCognitoAction],
  },
];
