import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';

export const rescheduleLambda = async (
  applicationContext: ServerApplicationContext,
  { event }: { event: any },
  delay: number = 30,
) => {
  const authorizedUser: AuthUser = {
    email: 'system@ustc.gov',
    name: 'ustc automated system',
    role: 'docketclerk',
    userId: 'N/A',
  };
  await applicationContext.getWorkerGateway().queueWork(applicationContext, {
    message: {
      authorizedUser,
      delay,
      payload: {
        functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
        originalEvent: event,
      },
      type: MESSAGE_TYPES.RESCHEDULE_LAMBDA,
    },
  });
};
