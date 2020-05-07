import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { shouldShowPreviewAction } from '../actions/shouldShowPreviewAction';

export const selectDocumentForPetitionQcPreviewSequence = [
  shouldShowPreviewAction,
  {
    no: [],
    yes: [selectDocumentForPreviewAction, ...setPdfPreviewUrlSequence],
  },
];
