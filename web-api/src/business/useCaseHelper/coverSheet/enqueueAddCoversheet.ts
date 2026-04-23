import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const enqueueAddCoversheet = async (
  applicationContext: ServerApplicationContext,
  {
    authorizedUser,
    docketEntryId,
    docketNumber,
  }: {
    authorizedUser: UnknownAuthUser;
    docketEntryId: string;
    docketNumber: string;
  },
): Promise<void> => {
  await applicationContext.getWorkerGateway().queueWork(applicationContext, {
    message: {
      authorizedUser: authorizedUser!,
      payload: { docketEntryId, docketNumber },
      type: MESSAGE_TYPES.ADD_COVERSHEET,
    },
  });
};
