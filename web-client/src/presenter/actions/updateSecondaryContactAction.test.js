import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateSecondaryContactAction } from './updateSecondaryContactAction';

const updateSecondaryContactInteractorStub = jest
  .fn()
  .mockReturnValue({ docketNumber: 'ayy' });

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateSecondaryContactInteractor: updateSecondaryContactInteractorStub,
  }),
};

describe('updateSecondaryContactAction', () => {
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

    expect(updateSecondaryContactInteractorStub).toHaveBeenCalled();
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Please confirm the information below is correct.',
        title: 'Your changes have been saved.',
      },
      caseId: 'ayy',
    });
  });
});
