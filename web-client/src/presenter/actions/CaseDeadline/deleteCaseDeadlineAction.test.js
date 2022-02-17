import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCaseDeadlineAction } from './deleteCaseDeadlineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

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

  it('sets automatic blocked fields on state', async () => {
    applicationContext
      .getUseCases()
      .deleteCaseDeadlineInteractor.mockReturnValue(MOCK_CASE);

    const result = await runAction(deleteCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          automaticBlocked: undefined,
          automaticBlockedDate: undefined,
          automaticBlockedReason: undefined,
          docketNumber: mockDocketNumber,
        },
        form: {
          caseDeadlineId: mockCaseDeadlineId,
        },
      },
    });

    expect(result.state.caseDetail.automaticBlocked).toEqual(
      MOCK_CASE.automaticBlocked,
    );
    expect(result.state.caseDetail.automaticBlockedDate).toEqual(
      MOCK_CASE.automaticBlockedDate,
    );
    expect(result.state.caseDetail.automaticBlockedReason).toEqual(
      MOCK_CASE.automaticBlockedReason,
    );
  });

  it('calls the success path with alertSuccess.message', async () => {
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
