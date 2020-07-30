import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updatePrimaryContactAction } from './updatePrimaryContactAction';

describe('updatePrimaryContactAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updatePrimaryContactInteractor.mockReturnValue({
        docketNumber: '101-20',
      });
  });

  it('updates primary contact for the current case', async () => {
    const result = await runAction(updatePrimaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            docketNumber: '101-20',
            name: 'Rachael Ray',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePrimaryContactInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Changes saved.',
      },
      docketNumber: '101-20',
    });
  });
});
