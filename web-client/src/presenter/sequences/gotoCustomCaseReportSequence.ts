import { getUsersInSectionAction } from '@web-client/presenter/actions/getUsersInSectionAction';
import { resetCustomCaseReportStateAction } from '../actions/resetCustomCaseReportStateAction';
import { setAllAndCurrentJudgesAction } from '@web-client/presenter/actions/setAllAndCurrentJudgesAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoCustomCaseReportSequence =
  startWebSocketConnectionSequenceDecorator([
    resetCustomCaseReportStateAction,
    setupCurrentPageAction('CustomCaseReport'),
    getUsersInSectionAction({ section: 'judge' }),
    setAllAndCurrentJudgesAction,
  ]);
