import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '@web-client/presenter/presenter-mock';
import { caseExistsAction } from '@web-client/presenter/actions/caseExistsAction';

describe('caseExistsAction', () => {
  let successMock;
  let errorMock;

  beforeEach(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };

    applicationContext
      .getUseCases()
      .getCaseExistsInteractor.mockResolvedValue();
  });

  it('calls the interactor for fetching the case', async () => {
    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-24',
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().getCaseExistsInteractor.mock.calls
        .length,
    ).toEqual(1);
  });

  it('calls the success path when the interactor runs successfully', async () => {
    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '101-24',
      },
      state: {},
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('calls the error path when an error is encountered', async () => {
    applicationContext
      .getUseCases()
      .getCaseExistsInteractor.mockRejectedValueOnce(new Error('Nope!'));

    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(errorMock).toHaveBeenCalled();
  });

  it('calls the error path and skips interactor when docketNumber is missing', async () => {
    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });

    expect(errorMock).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getCaseExistsInteractor,
    ).not.toHaveBeenCalled();
  });
});
