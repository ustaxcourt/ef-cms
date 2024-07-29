import { clearIrsNoticeFormAction } from '@web-client/presenter/actions/clearIrsNoticeFormAction';
import { setFormValueAction } from '@web-client/presenter/actions/setFormValueAction';
import { setIrsNoticeUploadFormInfoAction } from '@web-client/presenter/actions/setIrsNoticeUploadFormInfoAction';

export const setHasIrsNoticeSequence = [
  clearIrsNoticeFormAction,
  setIrsNoticeUploadFormInfoAction,
  setFormValueAction,
];
