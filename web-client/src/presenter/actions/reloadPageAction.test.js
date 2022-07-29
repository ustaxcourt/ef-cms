import { reloadPageAction } from './reloadPageAction';
import { runAction } from 'cerebral/test';

describe('reloadPageAction', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        configurable: true,
        reload: jest.fn(),
        value: { reload: jest.fn() },
      },
      writable: true,
    });
  });

  it('should call location reload api', async () => {
    await runAction(reloadPageAction);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
