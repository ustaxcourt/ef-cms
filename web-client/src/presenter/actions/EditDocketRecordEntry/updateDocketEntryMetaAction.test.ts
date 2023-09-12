import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateDocketEntryMetaAction } from './updateDocketEntryMetaAction';

presenter.providers.applicationContext = applicationContext;

describe('updateDocketEntryMetaAction', () => {
  let errorMock;
  let successMock;

  beforeAll(() => {
    errorMock = jest.fn();
    successMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('updates the docket entry by calling the interactor', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        docketRecordEntry: {
          servedParties: [],
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateDocketEntryMetaInteractor,
    ).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path calling the interactor generates an error', async () => {
    applicationContext
      .getUseCases()
      .updateDocketEntryMetaInteractor.mockImplementation(() => {
        throw new Error('Guy Fieri has connected to the server.');
      });

    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        docketRecordEntry: {
          documentTitle: 'Test Description',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
