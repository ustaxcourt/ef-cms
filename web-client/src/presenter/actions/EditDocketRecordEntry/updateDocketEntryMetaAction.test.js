import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDocketEntryMetaAction } from './updateDocketEntryMetaAction';

describe('updateDocketEntryMetaAction', () => {
  let updateDocketEntryMetaInteractorStub;

  beforeEach(() => {
    updateDocketEntryMetaInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateDocketEntryMetaInteractor: updateDocketEntryMetaInteractorStub,
      }),
    };
  });

  it('updates the docket entry by calling the interactor', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
    });

    expect(updateDocketEntryMetaInteractorStub).toHaveBeenCalled();
  });
});
