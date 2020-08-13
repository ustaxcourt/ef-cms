import { getDocumentSelectedForPreviewAction } from '../actions/getDocumentSelectedForPreviewAction';
import { getDocumentUrlForPreviewAction } from '../actions/getDocumentUrlForPreviewAction';
import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { state } from 'cerebral';
import { takePathForDocumentPreviewAction } from '../actions/takePathForDocumentPreviewAction';
import { unsetDocumentIdAction } from '../actions/unsetDocumentIdAction';

export const setDocumentForPreviewSequence = [
  getDocumentSelectedForPreviewAction,
  takePathForDocumentPreviewAction,
  {
    documentInS3: [
      getDocumentUrlForPreviewAction,
      setPdfPreviewUrlAction,
      setDocumentIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
    no: [
      unsetDocumentIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'scan'),
    ],
    pdfInMemory: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlAction,
      unsetDocumentIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
  },
];
