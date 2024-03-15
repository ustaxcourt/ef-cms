export const resolveAsyncSyncRequestAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const { asyncSyncId, response } = props;

  const callback = applicationContext
    .getAsynSyncUtil()
    .getAsyncSyncResult(asyncSyncId);

  if (callback) callback(response);
};
