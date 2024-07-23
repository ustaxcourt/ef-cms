import { clearIrsNoticeRedactionAcknowledgementAction } from '@web-client/presenter/actions/clearIrsNoticeRedactionAcknowledgementAction';
import { updateIrsNoticeIndexPropertyAction } from '@web-client/presenter/actions/updateIrsNoticeUploadedFileAction';

export const updateIrsNoticeIndexPropertySequence = [
  updateIrsNoticeIndexPropertyAction,
  clearIrsNoticeRedactionAcknowledgementAction,
];
