import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setPdfPreviewUrlSequence } from '../sequences/setPdfPreviewUrlSequence';
import { shouldShowPreviewAction } from '../actions/shouldShowPreviewAction';
import { state } from 'cerebral';

export const selectDocumentForScanSequence = [
  set(state.currentViewMetadata.documentUploadMode, 'scan'),
  shouldShowPreviewAction,
  {
    no: [],
    yes: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlSequence,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
  },
];
