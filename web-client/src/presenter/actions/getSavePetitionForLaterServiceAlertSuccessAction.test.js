import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getSavePetitionForLaterServiceAlertSuccessAction } from './getSavePetitionForLaterServiceAlertSuccessAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
