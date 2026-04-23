import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateContactAction } from './updateContactAction';

describe('updateContactAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext.getUseCases().updateContactInteractor.mockReturnValue(
      undefined,
    );
  });

  it('updates primary contact for the current case', async () => {
    const result = await runAction(updateContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contact: {
            name: 'Rachael Ray',
          },
          docketNumber: '101-20',
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
