import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { extractUserNotesFromCalendaredCasesAction } from '../actions/TrialSession/extractUserNotesFromCalendaredCasesAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getConstants } from '../../getConstants';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { getUserCaseNoteForCasesAction } from '../actions/TrialSession/getUserCaseNoteForCasesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { gotoTrialSessionDetailSequence } from './gotoTrialSessionDetailSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { isUserAssociatedWithTrialSessionAction } from '../actions/TrialSession/isUserAssociatedWithTrialSessionAction';
import { mergeCaseOrderIntoCalendaredCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoCalendaredCasesAction';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setCaseNotesOntoCalendaredCasesAction } from '../actions/TrialSession/setCaseNotesOntoCalendaredCasesAction';
import { setDefaultWorkingCopyValuesAction } from '../actions/TrialSessionWorkingCopy/setDefaultWorkingCopyValuesAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../actions/TrialSession/setTrialSessionIdAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';
import { setUsersAction } from '../actions/setUsersAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { takePathForRoles } from './takePathForRoles';
const { USER_ROLES } = getConstants();

const checkUserAssociationAndProceed = [
  isUserAssociatedWithTrialSessionAction,
  {
    no: [...gotoTrialSessionDetailSequence],
    yes: [
      getTrialSessionWorkingCopyAction,
      setTrialSessionWorkingCopyAction,
      setDefaultWorkingCopyValuesAction,
      isTrialSessionCalendaredAction,
      {
        no: [],
        yes: [
          getCalendaredCasesForTrialSessionAction,
          setCalendaredCasesOnTrialSessionAction,
          mergeCaseOrderIntoCalendaredCasesAction,
          getUserCaseNoteForCasesAction,
          setCaseNotesOntoCalendaredCasesAction,
          extractUserNotesFromCalendaredCasesAction,
        ],
      },
      setupCurrentPageAction('TrialSessionWorkingCopy'),
    ],
  },
];

const gotoTrialSessionDetails = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  clearErrorAlertsAction,
  setTrialSessionIdAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  getJudgeForCurrentUserAction,
  setJudgeUserAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        USER_ROLES.adc,
        USER_ROLES.admissionsClerk,
        USER_ROLES.clerkOfCourt,
        USER_ROLES.caseServicesSupervisor,
        USER_ROLES.docketClerk,
        USER_ROLES.petitionsClerk,
      ],
      gotoTrialSessionDetailSequence,
    ),
    chambers: [
      getUsersInSectionAction({}),
      setUsersAction,
      ...checkUserAssociationAndProceed,
    ],
    judge: checkUserAssociationAndProceed,
    trialclerk: checkUserAssociationAndProceed,
  },
]);

export const gotoTrialSessionWorkingCopySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionDetails,
    unauthorized: [navigateToLoginSequence],
  },
];
