import { reloadPageAction } from './reloadPageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('reloadPageAction', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });
  it('should call location reload api', async () => {
    await runAction(reloadPageAction);
    expect(location.reload).toHaveBeenCalled();
  });
});
