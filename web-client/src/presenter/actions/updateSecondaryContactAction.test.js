import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateSecondaryContactAction } from './updateSecondaryContactAction';

describe('updateSecondaryContactAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updateSecondaryContactInteractor.mockReturnValue({
        docketNumber: '101-20',
      });
  });

  it('updates secondary contact for the current case', async () => {
    const result = await runAction(updateSecondaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactSecondary: { name: 'Rachael Ray' },
          docketNumber: '101-20',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateSecondaryContactInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Changes saved.',
      },
      docketNumber: '101-20',
    });
  });
});
