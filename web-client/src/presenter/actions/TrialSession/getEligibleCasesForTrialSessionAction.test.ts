import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getEligibleCasesForTrialSessionAction } from './getEligibleCasesForTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getEligibleCasesForTrialSessionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getEligibleCasesForTrialSessionInteractor.mockResolvedValue([
        { docketNumber: '345-20' },
      ]);
  });

  it('call the use case to get the eligible cases', async () => {
    await runAction(getEligibleCasesForTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(
      applicationContext.getUseCases()
        .getEligibleCasesForTrialSessionInteractor,
    ).toHaveBeenCalled();
  });
});
