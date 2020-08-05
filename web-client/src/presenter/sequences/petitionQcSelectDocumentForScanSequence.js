import { getDocumentUrlForPreviewAction } from '../actions/getDocumentUrlForPreviewAction';
import { petitionQcShouldShowPreviewAction } from '../actions/petitionQcShouldShowPreviewAction';
import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { state } from 'cerebral';

export const petitionQcSelectDocumentForScanSequence = [
  petitionQcShouldShowPreviewAction,
  {
    no: [set(state.currentViewMetadata.documentUploadMode, 'scan')],
    pdfInMemory: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlAction,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
    pdfInS3: [
      getDocumentUrlForPreviewAction,
      setPdfPreviewUrlAction,
      setDocumentIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
  },
];
