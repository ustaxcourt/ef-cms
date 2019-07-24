import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updatePrimaryContactAction } from './updatePrimaryContactAction';

const updatePrimaryContactInteractorStub = jest
  .fn()
  .mockReturnValue({ docketNumber: 'ayy' });

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updatePrimaryContactInteractor: updatePrimaryContactInteractorStub,
  }),
};

describe('updatePrimaryContactAction', () => {
  it('updates primary contact for the current case', async () => {
    const result = await runAction(updatePrimaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
      },
    });

    expect(updatePrimaryContactInteractorStub).toHaveBeenCalled();
    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Please confirm the information below is correct.',
        title: 'Your changes have been saved.',
      },
      caseId: 'ayy',
      tab: 'caseInfo',
    });
  });
});
