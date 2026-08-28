import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../../actions/closeMobileMenuAction';
import { getDocketClerksForReportAction } from '../../actions/DocketClerkReport/getDocketClerksForReportAction';
import { resetDocketClerkReportAction } from '../../actions/DocketClerkReport/resetDocketClerkReportAction';
import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoDocketClerkReportSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    closeMobileMenuAction,
    clearErrorAlertsAction,
    clearScreenMetadataAction,
    resetDocketClerkReportAction,
    getDocketClerksForReportAction,
    setupCurrentPageAction('DocketClerkReport'),
  ]);
