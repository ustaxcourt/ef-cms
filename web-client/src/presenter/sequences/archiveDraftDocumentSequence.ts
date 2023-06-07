import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearDraftDocumentViewerAction } from '../actions/clearDraftDocumentViewerAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { loadDefaultDraftViewerDocumentToDisplaySequence } from './DocketEntry/loadDefaultDraftViewerDocumentToDisplaySequence';
import { parallel } from 'cerebral';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const archiveDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  clearDraftDocumentViewerAction,
  archiveDraftDocumentAction,
  {
    error: [setShowModalFactoryAction('DocketEntryHasAlreadyBeenServedModal')],
    success: [
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setCaseAction,
      parallel([
        [getConsolidatedCasesByCaseAction, setConsolidatedCasesForCaseAction],
        [getMessagesForCaseAction],
      ]),
      resetArchiveDraftDocumentAction,
      loadDefaultDraftViewerDocumentToDisplaySequence,
    ],
  },
]);
