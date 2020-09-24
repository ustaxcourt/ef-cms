import { getDocumentSelectedForPreviewAction } from '../actions/getDocumentSelectedForPreviewAction';
import { getDocumentUrlForPreviewAction } from '../actions/getDocumentUrlForPreviewAction';
import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { state } from 'cerebral';
import { takePathForDocumentPreviewAction } from '../actions/takePathForDocumentPreviewAction';
import { unsetDocketEntryIdAction } from '../actions/unsetDocketEntryIdAction';

export const setDocumentForPreviewSequence = [
  getDocumentSelectedForPreviewAction,
  takePathForDocumentPreviewAction,
  {
    documentInS3: [
      getDocumentUrlForPreviewAction,
      setPdfPreviewUrlAction,
      setDocketEntryIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
    no: [
      unsetDocketEntryIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'scan'),
    ],
    pdfInMemory: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlAction,
      unsetDocketEntryIdAction,
      set(state.currentViewMetadata.documentUploadMode, 'preview'),
    ],
  },
];
