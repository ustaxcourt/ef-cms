import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCalendaredCasesForTrialSessionAction } from './getCalendaredCasesForTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getCalendaredCasesForTrialSessionAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor.mockResolvedValue([
        {
          caseId: '345',
        },
      ]);
  });

  it('call the use case to get the calendared cases', async () => {
    await runAction(getCalendaredCasesForTrialSessionAction, {
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
        .getCalendaredCasesForTrialSessionInteractor,
    ).toBeCalled();
  });
});
