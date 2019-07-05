import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updatePrimaryContactAction } from './updatePrimaryContactAction';

const updatePrimaryContactInteractorStub = jest.fn();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updatePrimaryContactInteractor: updatePrimaryContactInteractorStub,
  }),
};

describe('updatePrimaryContactAction', () => {
  it('updates primary contact for the current case', async () => {
    await runAction(updatePrimaryContactAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
      },
    });
    expect(updatePrimaryContactInteractorStub).toHaveBeenCalled();
  });
});
