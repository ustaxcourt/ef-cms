import { getDocumentStorageIdAction } from '../actions/DocketEntry/getDocumentStorageIdAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { getSingleDocketEntryAction } from '../actions/getSingleDocketEntryAction';
import { parallel } from 'cerebral/factories';
import { setCaseMetadataWithDocketEntryAction } from '../actions/setCaseMetadataWithDocketEntryAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setMessageIdAction } from '../actions/setMessageIdAction';
import { setPDFForSigningAction } from '../actions/setPDFForSigningAction';
import { setPDFPageForSigningAction } from '../actions/setPDFPageForSigningAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSignatureNameForPdfSigningAction } from '../actions/setSignatureNameForPdfSigningAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoSignOrderSequence = startWebSocketConnectionSequenceDecorator([
  setupCurrentPageAction('Interstitial'),
  setRedirectUrlAction,
  parallel([getCaseMetadataAction, getSingleDocketEntryAction]),
  setCaseMetadataWithDocketEntryAction,
  setDocketEntryIdAction,
  setMessageIdAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  setSignatureNameForPdfSigningAction,
  getDocumentStorageIdAction,
  setPDFForSigningAction,
  setPDFPageForSigningAction,
  setParentMessageIdAction,
  setupCurrentPageAction('SignOrder'),
]);
