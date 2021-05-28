import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateContactAction } from './updateContactAction';

describe('updateContactAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases().updateContactInteractor.mockReturnValue({
      docketNumber: '101-20',
    });
  });

  it('updates primary contact for the current case', async () => {
    const result = await runAction(updateContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: {
            docketNumber: '101-20',
            name: 'Rachael Ray',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateContactInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Changes saved.',
      },
      docketNumber: '101-20',
    });
  });
});
