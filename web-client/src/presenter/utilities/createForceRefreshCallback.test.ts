import { createForceRefreshCallback } from './createForceRefreshCallback';

describe('createForceRefreshCallback', () => {
  it('reloads the page when app bootstrap is not complete', async () => {
    const bootstrapState = { isReady: false };
    const onAppUpdated = jest.fn();
    const reloadPage = jest.fn();

    const callback = createForceRefreshCallback({
      bootstrapState,
      onAppUpdated,
      reloadPage,
    });

    await callback();

    expect(reloadPage).toHaveBeenCalled();
    expect(onAppUpdated).not.toHaveBeenCalled();
  });

  it('opens the app updated flow when app bootstrap is complete', async () => {
    const bootstrapState = { isReady: true };
    const onAppUpdated = jest.fn();
    const reloadPage = jest.fn();

    const callback = createForceRefreshCallback({
      bootstrapState,
      onAppUpdated,
      reloadPage,
    });

    await callback();

    expect(onAppUpdated).toHaveBeenCalled();
    expect(reloadPage).not.toHaveBeenCalled();
  });
});
