import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { deleteCaseDeadlineAction } from './deleteCaseDeadlineAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('deleteCaseDeadlineAction', () => {
  const mockCaseDeadlineId = '5ee663e4-cdec-44e4-b312-add2b8f2432f';
  const mockDocketNumber = '123-20';

  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call deleteCaseDeadlineInteractor and return success', async () => {
    applicationContext
      .getUseCases()
      .deleteCaseDeadlineInteractor.mockReturnValue(undefined);

    await runAction(deleteCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form: {
          caseDeadlineId: mockCaseDeadlineId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().deleteCaseDeadlineInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      caseDeadlineId: mockCaseDeadlineId,
      docketNumber: mockDocketNumber,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call the success path with alertSuccess.message', async () => {
    applicationContext
      .getUseCases()
      .deleteCaseDeadlineInteractor.mockReturnValue(MOCK_CASE);

    await runAction(deleteCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        form: {
          caseDeadlineId: mockCaseDeadlineId,
        },
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
    expect(successStub.mock.calls[0][0]).toEqual({
      alertSuccess: {
        message: 'Deadline removed.',
      },
    });
  });
});
