import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFStampDataAction } from '../actions/ApplyStamp/clearPDFStampDataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const goToApplyStampSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setCurrentPageAction('Interstitial'),
      getCaseAction,
      setCaseAction,
      setDocketEntryIdAction,
      clearPDFStampDataAction,
      clearFormAction,
      setSignatureNameForPdfSigningAction,
      setPDFForSigningAction,
      setPDFPageForSigningAction,
      setCurrentPageAction('ApplyStamp'),
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
