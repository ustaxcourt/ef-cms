import { getDocumentSelectedForPreviewAction } from '../actions/getDocumentSelectedForPreviewAction';
import { getDocumentUrlForPreviewAction } from '../actions/getDocumentUrlForPreviewAction';
import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setDocumentUploadModeAction } from '../actions/setDocumentUploadModeAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
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
      setDocumentUploadModeAction('preview'),
    ],
    no: [unsetDocketEntryIdAction, setDocumentUploadModeAction('scan')],
    pdfInMemory: [
      selectDocumentForPreviewAction,
      setPdfPreviewUrlAction,
      unsetDocketEntryIdAction,
      setDocumentUploadModeAction('preview'),
    ],
  },
];
