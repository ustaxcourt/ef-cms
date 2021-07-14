import { setupTest } from './helpers';
import { unauthedUserViewsHealthCheck } from './journey/unauthedUserViewsHealthCheck';

const cerebralTest = setupTest();

describe('Unauthed user views health check', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  unauthedUserViewsHealthCheck(cerebralTest);
});
