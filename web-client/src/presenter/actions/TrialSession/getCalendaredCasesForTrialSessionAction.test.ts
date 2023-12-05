import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCalendaredCasesForTrialSessionAction } from './getCalendaredCasesForTrialSessionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCalendaredCasesForTrialSessionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor.mockResolvedValue([
        {
          docketNumber: '123-45',
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
    ).toHaveBeenCalled();
  });
});
