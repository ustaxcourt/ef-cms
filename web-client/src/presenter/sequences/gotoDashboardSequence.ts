import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearSelectedWorkItemsAction } from '../actions/clearSelectedWorkItemsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCaseWorksheetsAction } from '@web-client/presenter/actions/CaseWorksheet/getCaseWorksheetsAction';
import { getConstants } from '../../getConstants';
import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getMaintenanceModeAction } from '../actions/getMaintenanceModeAction';
import { getOpenAndClosedCasesForUserAction } from '../actions/Dashboard/getOpenAndClosedCasesForUserAction';
import { getSubmittedAndCavCasesForJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/getSubmittedAndCavCasesForJudgeAction';
import { getTrialSessionsForJudgeAction } from '../actions/TrialSession/getTrialSessionsForJudgeAction';
import { getUserAction } from '../actions/getUserAction';
import { gotoMaintenanceSequence } from './gotoMaintenanceSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { navigateToSectionDocumentQCAction } from '../actions/navigateToSectionDocumentQCAction';
import { parallel } from 'cerebral';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setCaseWorksheetsByJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/setCaseWorksheetsByJudgeAction';
import { setCasesAction } from '../actions/setCasesAction';
import { setDefaultCaseTypeToDisplayAction } from '../actions/setDefaultCaseTypeToDisplayAction';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setMessageInboxPropsAction } from '../actions/setMessageInboxPropsAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setSubmittedAndCavCasesForJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/setSubmittedAndCavCasesForJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionAction } from '../actions/WebSocketConnection/startWebSocketConnectionAction';
import { takePathForRoles } from './takePathForRoles';

const { USER_ROLES } = getConstants();

const proceedToMessages = [navigateToMessagesAction];

const getMessages = [getInboxMessagesForUserAction, setMessagesAction];

const goToDashboard = [
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearSelectedWorkItemsAction,
  clearErrorAlertsAction,
  parallel([
    [getUserAction, setUserAction, setUserPermissionsAction],
    [
      getMaintenanceModeAction,
      {
        maintenanceOff: [
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
                  setMessageInboxPropsAction,
                  getMessages,
                  getJudgeForCurrentUserAction,
                  setJudgeUserAction,
                  getTrialSessionsForJudgeAction,
                  setTrialSessionsAction,
                  getCaseWorksheetsAction,
                  getSubmittedAndCavCasesForJudgeAction,
                  setSubmittedAndCavCasesForJudgeAction,
                  setCaseWorksheetsByJudgeAction,
                  setupCurrentPageAction('DashboardChambers'),
                ],
                general: [navigateToSectionDocumentQCAction],
                inactivePractitioner: [
                  setupCurrentPageAction('DashboardInactive'),
                ],
                irsPractitioner: [
                  setDefaultCaseTypeToDisplayAction,
                  getOpenAndClosedCasesForUserAction,
                  setCasesAction,
                  setupCurrentPageAction('DashboardRespondent'),
                ],
                irsSuperuser: [setupCurrentPageAction('DashboardIrsSuperuser')],
                judge: [
                  setMessageInboxPropsAction,
                  getMessages,
                  getJudgeForCurrentUserAction,
                  setJudgeUserAction,
                  getTrialSessionsForJudgeAction,
                  setTrialSessionsAction,
                  getCaseWorksheetsAction,
                  getSubmittedAndCavCasesForJudgeAction,
                  setSubmittedAndCavCasesForJudgeAction,
                  setCaseWorksheetsByJudgeAction,
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
        ],
        maintenanceOn: [gotoMaintenanceSequence],
      },
    ],
  ]),
];

export const gotoDashboardSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [goToDashboard],
    unauthorized: [redirectToCognitoAction],
  },
];
