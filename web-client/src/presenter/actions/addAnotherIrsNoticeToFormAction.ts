import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const addAnotherIrsNoticeToFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const irsNoticeUploadFormInfo = get(state.irsNoticeUploadFormInfo);

  const MAX_NUMBER_OF_IRS_NOTICE = 5;
  if (irsNoticeUploadFormInfo.length >= MAX_NUMBER_OF_IRS_NOTICE) return;

  irsNoticeUploadFormInfo.push({
    key: applicationContext.getUniqueId(),
    todayDate: applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD),
  });
  store.set(state.irsNoticeUploadFormInfo, irsNoticeUploadFormInfo);
};
