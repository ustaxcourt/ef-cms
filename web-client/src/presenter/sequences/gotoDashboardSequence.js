import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getConstants } from '../../getConstants';
import { getInboxCaseMessagesForUserAction } from '../actions/getInboxCaseMessagesForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getOpenAndClosedCasesByUserAction } from '../actions/caseConsolidation/getOpenAndClosedCasesByUserAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserAction } from '../actions/getUserAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { set } from 'cerebral/factories';
import { setCaseMessagesAction } from '../actions/setCaseMessagesAction';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCaseTypeToDisplayAction } from '../actions/setDefaultCaseTypeToDisplayAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setMessageInboxPropsAction } from '../actions/setMessageInboxPropsAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserAction } from '../actions/setUserAction';
import { state } from 'cerebral';
import { takePathForRoles } from './takePathForRoles';
const { USER_ROLES } = getConstants();

const proceedToMessages = [navigateToMessagesAction];

const getCaseMessages = [
  getInboxCaseMessagesForUserAction,
  setCaseMessagesAction,
];

const goToDashboard = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  getUserAction,
  setUserAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.admin,
        USER_ROLES.adc,
        USER_ROLES.admissionsClerk,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.docketClerk,
        USER_ROLES.floater,
        USER_ROLES.petitionsClerk,
        USER_ROLES.trialClerk,
      ],
      proceedToMessages,
    ),
    chambers: [
      setMessageInboxPropsAction,
      getCaseMessages,
      getJudgeForCurrentUserAction,
      setJudgeUserAction,
      getTrialSessionsAction,
      setTrialSessionsAction,
      setCurrentPageAction('DashboardChambers'),
    ],
    inactivePractitioner: [setCurrentPageAction('DashboardInactive')],
    irsPractitioner: [
      setDefaultCaseTypeToDisplayAction,
      getOpenAndClosedCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardRespondent'),
    ],
    irsSuperuser: [setCurrentPageAction('DashboardIrsSuperuser')],
    judge: [
      setMessageInboxPropsAction,
      getCaseMessages,
      getTrialSessionsAction,
      setTrialSessionsAction,
      setCurrentPageAction('DashboardJudge'),
    ],
    petitioner: [
      setDefaultCaseTypeToDisplayAction,
      getOpenAndClosedCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    privatePractitioner: [
      setDefaultCaseTypeToDisplayAction,
      getOpenAndClosedCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
  },
];

export const gotoDashboardSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [goToDashboard],
    unauthorized: [redirectToCognitoAction],
  },
];
