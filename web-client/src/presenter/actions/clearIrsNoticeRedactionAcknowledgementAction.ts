import { state } from '@web-client/presenter/app.cerebral';

export const clearIrsNoticeRedactionAcknowledgementAction = ({
  get,
  store,
}: ActionProps) => {
  const notices = get(state.irsNoticeUploadFormInfo);
  const noticesWithFiles = notices?.filter(notice => !!notice.file).length;
  if (!noticesWithFiles) {
    store.unset(state.form.irsNoticesRedactionAcknowledgement);
  }
};
