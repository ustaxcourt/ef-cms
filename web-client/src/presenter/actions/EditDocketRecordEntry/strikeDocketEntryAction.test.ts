import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { strikeDocketEntryAction } from './strikeDocketEntryAction';

presenter.providers.applicationContext = applicationContext;

describe('strikeDocketEntryAction', () => {
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

  it('strikes a docket entry successfully by calling the interactor', async () => {
    await runAction(strikeDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        form: {
          docketEntryId: 'document-id-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().strikeDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it('returns the error path if calling the interactor generates an error', async () => {
    applicationContext
      .getUseCases()
      .strikeDocketEntryInteractor.mockImplementation(() => {
        throw new Error('Guy Fieri has connected to the server.');
      });

    await runAction(strikeDocketEntryAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        form: {
          docketEntryId: 'document-id-123',
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
