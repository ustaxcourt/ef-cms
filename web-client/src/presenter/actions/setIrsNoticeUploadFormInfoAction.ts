import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const setIrsNoticeUploadFormInfoAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.irsNoticeUploadFormInfo, [
    {
      key: applicationContext.getUniqueId(),
      todayDate: applicationContext.getUtilities().formatNow(FORMATS.YYYYMMDD),
    },
  ]);
};
