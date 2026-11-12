import { runAction } from '@web-client/presenter/test.cerebral';
import { resetClerkOfCourtDashboardOptionsAction } from './resetClerkOfCourtDashboardOptionsAction';

describe('resetClerkOfCourtDashboardOptionsAction', () => {
  it('resets dashboard options to default values', async () => {
    const result = await runAction(resetClerkOfCourtDashboardOptionsAction, {
      state: {
        clerkOfCourtDashboardOptions: {
          casesByYearIsFiscal: true,
          petitionsByYearIsFiscal: true,
        },
      },
    });

    expect(result.state).toMatchObject({
      clerkOfCourtDashboardOptions: {
        casesByYearIsFiscal: false,
        petitionsByYearIsFiscal: false,
      },
    });
  });
});
