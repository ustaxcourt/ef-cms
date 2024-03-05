import { AsyncMessage } from '@web-api/asyncRouter';
import { ServerApplicationContext } from '@web-api/applicationContext';

export function getAsyncGateway() {
  return {
    runAsync(
      applicationContext: ServerApplicationContext,
      message: { message: AsyncMessage },
    ) {
      if (applicationContext.environment.stage === 'local') {
        return localAsync(applicationContext, message);
      }
      return realAsync(applicationContext, message);
    },
  };
}

export function localAsync(
  applicationContext: ServerApplicationContext,
  { message }: AsyncMessage,
) {}
export function realAsync(
  applicationContext: ServerApplicationContext,
  { message }: AsyncMessage,
) {}
