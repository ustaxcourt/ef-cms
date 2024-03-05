import { AsyncMessage, asyncRouter } from '@web-api/asyncRouter';
import { createApplicationContext } from '@web-api/applicationContext';

export function asyncLambda(event: AsyncMessage) {
  const applicationContext = createApplicationContext(event.user);
  return asyncRouter(applicationContext, { message: event });
}
