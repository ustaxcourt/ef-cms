import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getEligibleCasesForTrialSessionAction } from './getEligibleCasesForTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getEligibleCasesForTrialSessionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getEligibleCasesForTrialSessionInteractor.mockResolvedValue([
        { caseId: '345' },
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
    ).toBeCalled();
  });
});
