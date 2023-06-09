import { createPaperServicePdfForCasesAction } from '../actions/TrialSession/createPaperServicePdfForCasesAction';
import { paperServiceCompleteSequence } from './paperServiceCompleteSequence';
import { shouldCreatePaperServicePdfForCasesAction } from '../actions/shouldCreatePaperServicePdfForCasesAction';

export const noticeGenerationCompleteSequence = [
  shouldCreatePaperServicePdfForCasesAction,
  {
    no: paperServiceCompleteSequence,
    yes: [createPaperServicePdfForCasesAction],
  },
];
