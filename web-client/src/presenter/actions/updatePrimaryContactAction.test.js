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
        docketNumber: 'ayy',
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
            caseId: '0880564b-b978-4450-a34a-08430808f931',
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
        message: 'Please confirm the information below is correct.',
        title: 'Your changes have been saved.',
      },
      caseId: 'ayy',
    });
  });
});
