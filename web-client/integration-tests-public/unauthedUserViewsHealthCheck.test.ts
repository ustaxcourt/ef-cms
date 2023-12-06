import { setupTest } from './helpers';
import { unauthedUserViewsHealthCheck } from './journey/unauthedUserViewsHealthCheck';

describe('Unauthed user views health check', () => {
  const cerebralTest = setupTest();

  unauthedUserViewsHealthCheck(cerebralTest);
});
