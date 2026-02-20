import { clearFormAction } from '../actions/clearFormAction';
import { computeJudgeNameWithTitleAction } from '@web-client/presenter/actions/computeJudgeNameWithTitleAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseMetadataAction } from '../actions/getCaseMetadataAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getMotionDocketEntriesAction } from '../actions/getMotionDocketEntriesAction';
import { getSingleDocketEntryAction } from '../actions/getSingleDocketEntryAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { parallel } from 'cerebral/factories';
import { setCaseMetadataAction } from '../actions/setCaseMetadataAction';
import { setCourtIssuedDocumentInitialDataAction } from '../actions/CourtIssuedDocketEntry/setCourtIssuedDocumentInitialDataAction';
import { setDefaultServiceStampAction } from '../actions/CourtIssuedDocketEntry/setDefaultServiceStampAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setIsEditingDocketEntryAction } from '../actions/setIsEditingDocketEntryAction';
import { setMotionDocketEntriesAction } from '../actions/setMotionDocketEntriesAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddCourtIssuedDocketEntrySequence =
  startWebSocketConnectionSequenceDecorator([
    setupCurrentPageAction('Interstitial'),
    stopShowValidationAction,
    clearFormAction,
    setRedirectUrlAction,
    getUsersInSectionAction({ section: 'judge' }),
    getFilterCurrentJudgeUsersAction,
    setUsersByKeyAction('judges'),
    parallel([
      getCaseMetadataAction,
      getSingleDocketEntryAction,
      getMotionDocketEntriesAction,
    ]),
    setCaseMetadataAction,
    setMotionDocketEntriesAction,
    setDocketEntryIdAction,
    setCourtIssuedDocumentInitialDataAction,
    setDefaultServiceStampAction,
    computeJudgeNameWithTitleAction,
    generateCourtIssuedDocumentTitleAction,
    setIsEditingDocketEntryAction(false),
    setupCurrentPageAction('CourtIssuedDocketEntry'),
  ]) as unknown as (props: { section: string; redirectUrl: string }) => void;
