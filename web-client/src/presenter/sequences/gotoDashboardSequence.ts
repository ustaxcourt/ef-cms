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
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getTrialSessionsForJudgeAction } from '../actions/TrialSession/getTrialSessionsForJudgeAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { navigateToSectionDocumentQCAction } from '../actions/navigateToSectionDocumentQCAction';
import { parallel } from 'cerebral';
import { passAlongJudgeUserAction } from '@web-client/presenter/actions/passAlongJudgeUserAction';
import { setRumUserContextAction } from '@web-client/presenter/actions/setRumUserContextAction';
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

// TEMPORARY: fire-and-forget action that triggers a 404 so CloudWatch RUM's
// http telemetry can be verified end-to-end. Activate with ?rum-http-error=1.
// Remove once confirmed working in RUM.
const triggerRumHttpTestAction = ({
  applicationContext,
}: ActionProps): void => {
  if (new URLSearchParams(window.location.search).get('rum-http-error') !== '1')
    return;
  applicationContext
    .getHttpClient()
    .get(`${process.env.API_URL}/rum-test-nonexistent-404`)
    .catch(() => {});
};

export const gotoDashboardSequence = [
  triggerRumHttpTestAction,
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearSelectedWorkItemsAction,
  clearErrorAlertsAction,
  setUserPermissionsAction,
  setRumUserContextAction,
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
            USER_ROLES.caseServicesSupervisor,
            USER_ROLES.docketClerk,
            USER_ROLES.floater,
            USER_ROLES.petitionsClerk,
            USER_ROLES.reportersOffice,
            USER_ROLES.trialClerk,
          ],
          proceedToMessages,
        ),
        clerkofcourt: [
          fetchUserNotificationsSequence,
          parallel([
            getMessages,
            [getTrialSessionsAction, setTrialSessionsAction],
          ]),
          setupCurrentPageAction('DashboardClerkOfCourt'),
        ],
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
          setupCurrentPageAction('DashboardExternalUser'),
        ],
        privatePractitioner: [
          setDefaultCaseTypeToDisplayAction,
          getOpenAndClosedCasesForUserAction,
          setCasesAction,
          setupCurrentPageAction('DashboardExternalUser'),
        ],
      },
    ],
  },
];
