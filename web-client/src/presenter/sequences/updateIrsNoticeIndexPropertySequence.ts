import { clearIrsNoticeRedactionAcknowledgementAction } from '@web-client/presenter/actions/clearIrsNoticeRedactionAcknowledgementAction';
import { updateIrsNoticeIndexPropertyAction } from '@web-client/presenter/actions/updateIrsNoticeUploadedFileAction';

export const updateIrsNoticeIndexPropertySequence = [
  updateIrsNoticeIndexPropertyAction,
  clearIrsNoticeRedactionAcknowledgementAction,
] as unknown as (props: {
  key: string | number;
  property: string;
  toFormat?: string;
  value: string | null;
}) => void;
