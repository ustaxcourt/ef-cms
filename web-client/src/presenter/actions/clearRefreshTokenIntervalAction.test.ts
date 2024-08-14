import { clearRefreshTokenIntervalAction } from '@web-client/presenter/actions/clearRefreshTokenIntervalAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearRefreshTokenIntervalAction', () => {
  it('should clear refreshTokenInterval (both in state and with clearInterval)', async () => {
    const mockInterval = 10;
    const mockClearInterval = jest.spyOn(global, 'clearInterval');
    const result = await runAction(clearRefreshTokenIntervalAction, {
      state: {
        refreshTokenInterval: mockInterval,
      },
    });

    expect(result.state.refreshTokenInterval).toBeUndefined();
    expect(mockClearInterval).toHaveBeenCalledWith(mockInterval);
  });
});
