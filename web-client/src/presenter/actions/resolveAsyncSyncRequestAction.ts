export const resolveAsyncSyncRequestAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const { asyncSyncId, response } = props;
  if (response.statusCode === 503) return;

  const callback = applicationContext
    .getAsynSyncUtil()
    .getAsyncSyncCompleter(asyncSyncId);

  if (callback) callback(response);
};
