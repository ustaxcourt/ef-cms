import { runAction } from '@web-client/presenter/test.cerebral';
import { setClerkOfCourtDashboardOptionAction } from './setClerkOfCourtDashboardOptionAction';

describe('setClerkOfCourtDashboardOptionAction', () => {
  it('sets a passed key of state.clerkOfCourtDashboardOptions to the passed value', async () => {
    const result = await runAction(setClerkOfCourtDashboardOptionAction, {
      props: {
        key: 'testKey',
        value: 'testValue',
      },
    });

    expect(result.state).toMatchObject({
      clerkOfCourtDashboardOptions: {
        testKey: 'testValue',
      },
    });
  });
});
