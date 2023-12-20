import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocketEntryFormForDocketEditAction } from '../actions/EditDocketRecord/setDocketEntryFormForDocketEditAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setFromPageAction } from '../actions/setFromPageAction';
import { setIsEditingDocketEntryAction } from '../actions/setIsEditingDocketEntryAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoEditCourtIssuedDocketEntry =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    setFromPageAction,
    stopShowValidationAction,
    clearFormAction,
    clearScreenMetadataAction,
    getUsersInSectionAction({ section: 'judge' }),
    getFilterCurrentJudgeUsersAction,
    setUsersByKeyAction('judges'),
    getCaseAction,
    setCaseAction,
    setDocketEntryFormForDocketEditAction,
    generateCourtIssuedDocumentTitleAction,
    setDocketEntryIdAction,
    setIsEditingDocketEntryAction(true),
    setupCurrentPageAction('CourtIssuedDocketEntry'),
  ]);

export const gotoEditCourtIssuedDocketEntrySequence = [
  gotoEditCourtIssuedDocketEntry,
];
