import { state } from '@web-client/presenter/app.cerebral';

export const removeIrsNoticeFromFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { index } = props;
  const data = get(state.irsNoticeUploadFormInfo);
  if (data[index]) data.splice(index, 1);
  store.set(state.irsNoticeUploadFormInfo, data);
};
