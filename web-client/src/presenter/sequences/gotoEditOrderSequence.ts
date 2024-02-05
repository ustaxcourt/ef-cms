import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentContentsAction } from '../actions/getDocumentContentsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDefaultTabStateAction } from '../actions/setDefaultTabStateAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setFormFromDraftStateAction } from '../actions/setFormFromDraftStateAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetCreateOrderAddedDocketNumbers } from '@web-client/presenter/actions/unsetCreateOrderAddedDocketNumbers';
import { unsetCreateOrderSelectedCases } from '@web-client/presenter/actions/unsetCreateOrderSelectedCases';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';

const gotoEditOrder = startWebSocketConnectionSequenceDecorator([
  setRedirectUrlAction,
  unsetDocumentToEditAction,
  unsetCreateOrderSelectedCases,
  unsetCreateOrderAddedDocketNumbers,
  clearModalAction,
  setDefaultTabStateAction,
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  getDocumentContentsAction,
  setFormFromDraftStateAction,
  setDocumentToEditAction,
  setParentMessageIdAction,
  convertHtml2PdfSequence,
  setupCurrentPageAction('CreateOrder'),
]);

export const gotoEditOrderSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditOrder,
    unauthorized: [redirectToCognitoAction],
  },
] as unknown as (props: {
  docketEntryIdToEdit: string;
  docketNumber: string;
}) => void;
