import { runAction } from 'cerebral/test';
import { setPathForMaintenancePageAction } from './setPathForMaintenancePageAction';

describe('setPathForMaintenancePageAction', () => {
  it('returns the path for the maintenance page', async () => {
    const { output } = await runAction(setPathForMaintenancePageAction, {
      props: {},
    });

    expect(output).toEqual({ path: '/maintenance' });
  });
});
