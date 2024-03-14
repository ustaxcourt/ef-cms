export const setAsyncSyncResultAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const { asyncSyncId, response } = props;

  applicationContext
    .getAsynSyncUtil()
    .setAsyncSyncResult(asyncSyncId, response);
};
