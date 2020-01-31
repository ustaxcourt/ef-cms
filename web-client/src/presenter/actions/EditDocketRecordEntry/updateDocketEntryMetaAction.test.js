import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDocketEntryMetaAction } from './updateDocketEntryMetaAction';

describe('updateDocketEntryMetaAction', () => {
  let updateDocketEntryMetaInteractorStub;
  let errorMock;
  let successMock;

  beforeEach(() => {
    updateDocketEntryMetaInteractorStub = jest.fn();

    errorMock = jest.fn();
    successMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateDocketEntryMetaInteractor: updateDocketEntryMetaInteractorStub,
      }),
    };
  });

  it('updates the docket entry by calling the interactor', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          caseId: '123-45',
        },
        docketRecordEntry: {
          servedParties: [],
        },
        docketRecordIndex: 1,
      },
    });

    expect(updateDocketEntryMetaInteractorStub).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path calling the interactor generates an error', async () => {
    presenter.providers.applicationContext.getUseCases = () => ({
      updateDocketEntryMetaInteractor: () => {
        throw new Error('Guy Fieri has connected to the server.');
      },
    });

    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          caseId: '123-45',
        },
        docketRecordEntry: {
          description: 'Test Description',
        },
        docketRecordIndex: 1,
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
