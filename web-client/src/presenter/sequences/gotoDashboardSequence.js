import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getBaseRouteAction } from '../actions/getBaseRouteAction';
import { getCasesByUserAction } from '../actions/getCasesByUserAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserAction } from '../actions/getUserAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setMessageInboxPropsAction } from '../actions/setMessageInboxPropsAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserAction } from '../actions/setUserAction';
import { setUsersAction } from '../actions/setUsersAction';
import { state } from 'cerebral';

const goToDashboard = [
  setCurrentPageAction('Interstitial'),
  getUserAction,
  setUserAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  getUserRoleAction,
  {
    docketclerk: [
      parallel([
        [getUsersInSectionAction({ section: 'docket' }), setUsersAction],
        [
          setCurrentPageAction('DashboardDocketClerk'),
          ...chooseWorkQueueSequence,
        ],
      ]),
    ],
    judge: [
      getBaseRouteAction,
      {
        dashboard: [setMessageInboxPropsAction],
        'document-qc': [],
        messages: [],
      },
      ...chooseWorkQueueSequence,
      getTrialSessionsAction,
      setTrialSessionsAction,
      getBaseRouteAction,
      {
        dashboard: [setCurrentPageAction('DashboardJudge')],
        'document-qc': [setCurrentPageAction('MessagesJudge')],
        messages: [setCurrentPageAction('MessagesJudge')],
      },
    ],
    petitioner: [
      clearAlertsAction,
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    petitionsclerk: [
      parallel([
        [getUsersInSectionAction({ section: 'petitions' }), setUsersAction],
        [
          setCurrentPageAction('DashboardPetitionsClerk'),
          ...chooseWorkQueueSequence,
        ],
      ]),
    ],
    practitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
    respondent: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardRespondent'),
    ],
    seniorattorney: [
      clearAlertsAction,
      setCurrentPageAction('DashboardSeniorAttorney'),
      ...chooseWorkQueueSequence,
    ],
  },
];

export const gotoDashboardSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToDashboard,
    unauthorized: [redirectToCognitoAction],
  },
];
