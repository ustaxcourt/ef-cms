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
        docketNumber: 'ayy',
      });
  });

  it('updates secondary contact for the current case', async () => {
    const result = await runAction(updateSecondaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseId: '851a973a-7569-43f5-93ec-613833929b82',
          contactSecondary: { name: 'Rachael Ray' },
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
      caseId: 'ayy',
    });
  });
});
