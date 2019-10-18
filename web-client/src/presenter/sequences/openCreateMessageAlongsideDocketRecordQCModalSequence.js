import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { computeSecondaryFormDateAction } from '../actions/FileDocument/computeSecondaryFormDateAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { set } from 'cerebral/factories';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { state } from 'cerebral';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openCreateMessageAlongsideDocketRecordQCModalSequence = [
  computeFormDateAction,
  computeSecondaryFormDateAction,
  computeCertificateOfServiceFormDateAction,
  computeDateReceivedAction,
  validateDocketEntryAction,
  {
    success: [
      clearModalStateAction,
      generateTitleAction,
      setCreateMessageModalDialogModalStateAction,
      set(state.showModal, 'CreateMessageAlongsideDocketRecordQCModal'),
    ],
  },
];
