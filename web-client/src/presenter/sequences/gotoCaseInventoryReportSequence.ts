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
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const gotoCaseInventoryReport = [
  setupCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  clearErrorAlertsAction,
  getSetJudgesSequence,
  setupCurrentPageAction('CaseInventoryReport'),
];

const gotoDashboardWithModal = [
  ...openCaseInventoryReportModalSequence,
  navigateToDashboardAction,
];

export const gotoCaseInventoryReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      hasCaseInventoryReportFilterSelectedAction,
      {
        no: gotoDashboardWithModal,
        proceed: parallel([
          fetchUserNotificationsSequence,
          gotoCaseInventoryReport,
        ]),
      },
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
