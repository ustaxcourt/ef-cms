import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearSelectedWorkItemsAction } from '../actions/clearSelectedWorkItemsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from '@web-client/presenter/sequences/fetchUserNotificationsSequence';
import { getConstants } from '../../getConstants';
import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getOpenAndClosedCasesForUserAction } from '../actions/Dashboard/getOpenAndClosedCasesForUserAction';
import { getPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/getPendingMotionDocketEntriesForCurrentJudgeAction';
import { getSubmittedAndCavCasesForCurrentJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/getSubmittedAndCavCasesForCurrentJudgeAction';
import { getTrialSessionsForJudgeAction } from '../actions/TrialSession/getTrialSessionsForJudgeAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { navigateToSectionDocumentQCAction } from '../actions/navigateToSectionDocumentQCAction';
import { parallel } from 'cerebral';
import { passAlongJudgeUserAction } from '@web-client/presenter/actions/passAlongJudgeUserAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCasesAction } from '../actions/setCasesAction';
import { setDefaultCaseTypeToDisplayAction } from '../actions/setDefaultCaseTypeToDisplayAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { setPendingMotionDocketEntriesForCurrentJudgeAction } from '@web-client/presenter/actions/PendingMotion/setPendingMotionDocketEntriesForCurrentJudgeAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setSubmittedAndCavCasesForJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/setSubmittedAndCavCasesForJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionAction } from '../actions/WebSocketConnection/startWebSocketConnectionAction';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const proceedToMessages = [navigateToMessagesAction];

const getMessages = [getInboxMessagesForUserAction, setMessagesAction];

export const gotoDashboardSequence = [
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearSelectedWorkItemsAction,
  clearErrorAlertsAction,
  setUserPermissionsAction,
  startWebSocketConnectionAction,
  {
    error: [setShowModalFactoryAction('WebSocketErrorModal')],
    success: [
      runPathForUserRoleAction,
      {
        ...takePathForRoles(
          [
            USER_ROLES.adc,
            USER_ROLES.admin,
            USER_ROLES.admissionsClerk,
            USER_ROLES.clerkOfCourt,
            USER_ROLES.caseServicesSupervisor,
            USER_ROLES.docketClerk,
            USER_ROLES.floater,
            USER_ROLES.petitionsClerk,
            USER_ROLES.reportersOffice,
            USER_ROLES.trialClerk,
          ],
          proceedToMessages,
        ),
        chambers: [
          fetchUserNotificationsSequence,
          getJudgeForCurrentUserAction,
          setJudgeUserAction,
          parallel([
            getMessages,
            [getTrialSessionsForJudgeAction, setTrialSessionsAction],
            [
              getSubmittedAndCavCasesForCurrentJudgeAction,
              setSubmittedAndCavCasesForJudgeAction,
            ],
            [
              getPendingMotionDocketEntriesForCurrentJudgeAction,
              setPendingMotionDocketEntriesForCurrentJudgeAction,
            ],
          ]),
          setupCurrentPageAction('DashboardChambers'),
        ],
        general: [navigateToSectionDocumentQCAction],
        inactivePractitioner: [setupCurrentPageAction('DashboardInactive')],
        irsPractitioner: [
          setDefaultCaseTypeToDisplayAction,
          getOpenAndClosedCasesForUserAction,
          setCasesAction,
          setupCurrentPageAction('DashboardRespondent'),
        ],
        irsSuperuser: [setupCurrentPageAction('DashboardIrsSuperuser')],
        judge: [
          fetchUserNotificationsSequence,
          passAlongJudgeUserAction,
          setJudgeUserAction,
          parallel([
            getMessages,
            [getTrialSessionsForJudgeAction, setTrialSessionsAction],
            [
              getSubmittedAndCavCasesForCurrentJudgeAction,
              setSubmittedAndCavCasesForJudgeAction,
            ],
            [
              getPendingMotionDocketEntriesForCurrentJudgeAction,
              setPendingMotionDocketEntriesForCurrentJudgeAction,
            ],
          ]),
          setupCurrentPageAction('DashboardJudge'),
        ],
        petitioner: [
          setDefaultCaseTypeToDisplayAction,
          getOpenAndClosedCasesForUserAction,
          setCasesAction,
          setupCurrentPageAction('DashboardPetitioner'),
        ],
        privatePractitioner: [
          setDefaultCaseTypeToDisplayAction,
          getOpenAndClosedCasesForUserAction,
          setCasesAction,
          setupCurrentPageAction('DashboardPractitioner'),
        ],
      },
    ],
  },
];
