import { petitionQcShouldShowPreviewAction } from '../actions/petitionQcShouldShowPreviewAction';
import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { state } from 'cerebral';

export const petitionQcSelectDocumentForScanSequence = [
  set(state.currentViewMetadata.documentUploadMode, 'scan'),
  petitionQcShouldShowPreviewAction,
  {
    no: [],
    yes: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlSequence,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
  },
];
