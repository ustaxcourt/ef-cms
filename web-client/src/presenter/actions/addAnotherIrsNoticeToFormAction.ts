import { state } from '@web-client/presenter/app.cerebral';

export const addAnotherIrsNoticeToFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const data = get(state.irsNoticeUploadFormInfo);
  data.push({ key: applicationContext.getUniqueId() });
  store.set(state.irsNoticeUploadFormInfo, data);
};
