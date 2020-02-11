import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { gotoDocumentDetailSequence } from './gotoDocumentDetailSequence';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { runBatchProcessAction } from '../actions/runBatchProcessAction';
import { sendPetitionToIRSHoldingQueueAction } from '../actions/sendPetitionToIRSHoldingQueueAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';

export const serveToIrsSequence = [
  computeFormDateAction,
  openFileUploadStatusModalAction,
  createCaseFromPaperAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      setCaseAction,
      setPetitionIdAction,
      closeFileUploadStatusModalAction,
      sendPetitionToIRSHoldingQueueAction,
      runBatchProcessAction,
      gotoDocumentDetailSequence,
    ],
  },
];
