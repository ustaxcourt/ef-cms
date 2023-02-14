import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
import { setPdfPreviewUrlSequence } from '../sequences/setPdfPreviewUrlSequence';
import { shouldShowPreviewAction } from '../actions/shouldShowPreviewAction';

export const selectDocumentForScanSequence = [
  setDocumentUploadModeAction('scan'),
  shouldShowPreviewAction,
  {
    no: [],
    yes: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlSequence,
      setDocumentUploadModeAction('preview'),
    ],
  },
];
