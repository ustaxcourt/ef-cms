import { getDocumentQCInboxForUserInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForUserProxy';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCInboxForUserAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const workItems = await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: user.userId,
    });

  return { workItems };
};
