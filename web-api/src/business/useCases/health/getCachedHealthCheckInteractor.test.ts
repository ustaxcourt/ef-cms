import { getCachedHealthCheckInteractor } from './getCachedHealthCheckInteractor';

describe('getCachedHealthCheckInteractor', () => {
  it('should get stored application health', () => {
    const result = getCachedHealthCheckInteractor();

    expect(result).toBeTruthy();
  });
});
