import { runAction } from '@web-client/presenter/test.cerebral';
import { resetClerkOfCourtDashboardOptionsAction } from './resetClerkOfCourtDashboardOptionsAction';

describe('resetClerkOfCourtDashboardOptionsAction', () => {
  it('resets dashboard options to default values', async () => {
    const result = await runAction(resetClerkOfCourtDashboardOptionsAction, {});

    expect(result.state).toMatchObject({
      clerkOfCourtDashboardOptions: {
        petitionsByYearIsFiscal: false,
      },
    });
  });
});
