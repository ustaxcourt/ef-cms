import { state } from '@web-client/presenter/app.cerebral';

export const setIrsNoticeUploadFormInfoAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.irsNoticeUploadFormInfo, [
    { key: applicationContext.getUniqueId() },
  ]);
};
