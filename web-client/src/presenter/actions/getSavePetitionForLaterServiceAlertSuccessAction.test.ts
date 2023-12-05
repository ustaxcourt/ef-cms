import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getSavePetitionForLaterServiceAlertSuccessAction } from './getSavePetitionForLaterServiceAlertSuccessAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSavePetitionForLaterServiceAlertSuccessAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns an object containing the alertSuccess object', async () => {
    const { output } = await runAction(
      getSavePetitionForLaterServiceAlertSuccessAction,
      {
        modules: {
          presenter,
        },
      },
    );
    expect(output).toEqual({
      alertSuccess: {
        message: 'Petition saved for later service.',
      },
    });
  });
});
