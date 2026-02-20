import { clearFormAction } from '../actions/clearFormAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setRespondentCounselFormAction } from '../actions/CaseAssociation/setRespondentCounselFormAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditRespondentCounselSequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    getCaseMetadataAction,
    setCaseMetadataAction,
    setRespondentCounselFormAction,
    setupCurrentPageAction('EditRespondentCounsel'),
  ]);
