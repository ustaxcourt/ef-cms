import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocketEntryFormForDocketEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForDocketEditAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setIsEditingDocketEntryAction } from '../actions/setIsEditingDocketEntryAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditCourtIssuedDocketEntry =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getUsersInSectionAction({ section: 'judge' }),
    getFilterCurrentJudgeUsersAction,
    setUsersByKeyAction('judges'),
    getCaseAction,
    setCaseAction,
    setDocketEntryFormForDocketEditAction,
    getComputedFormDateFactoryAction(null, true),
    generateCourtIssuedDocumentTitleAction,
    setDocketEntryIdAction,
    setIsEditingDocketEntryAction(true),
    setCurrentPageAction('CourtIssuedDocketEntry'),
  ]);

export const gotoEditCourtIssuedDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditCourtIssuedDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];
