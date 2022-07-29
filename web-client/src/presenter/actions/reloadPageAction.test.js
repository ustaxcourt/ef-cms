import { reloadPageAction } from './reloadPageAction';
import { runAction } from 'cerebral/test';

describe('reloadPageAction', () => {
  beforeAll(() => {
    global.window = {
      location: {
        configurable: true,
        reload: jest.fn(),
        value: { reload: jest.fn() },
      },
    };
  });

  afterAll(() => {
    delete global.window;
  });

  it('should call location reload api', async () => {
    await runAction(reloadPageAction);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
