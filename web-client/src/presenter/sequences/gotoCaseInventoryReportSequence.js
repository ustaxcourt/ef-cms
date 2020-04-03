import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { hasCaseInventoryReportFilterSelectedAction } from '../actions/CaseInventoryReport/hasCaseInventoryReportFilterSelectedAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { openCaseInventoryReportModalSequence } from './openCaseInventoryReportModalSequence';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoCaseInventoryReport = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  getSetJudgesSequence,
  setCurrentPageAction('CaseInventoryReport'),
];

const gotoDashboardWithModal = [
  ...openCaseInventoryReportModalSequence,
  navigateToDashboardAction,
];

export const gotoCaseInventoryReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      hasCaseInventoryReportFilterSelectedAction,
      {
        no: gotoDashboardWithModal,
        proceed: parallel([
          fetchUserNotificationsSequence,
          gotoCaseInventoryReport,
        ]),
      },
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
