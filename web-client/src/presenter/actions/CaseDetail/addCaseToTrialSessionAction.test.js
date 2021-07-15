import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { addCaseToTrialSessionAction } from './addCaseToTrialSessionAction';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('addCaseToTrialSessionAction', () => {
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
  });

  it('should call the addCaseToTrialSessionInteractor with the state.caseDetail.docketNumber, state.modal.trialSessionId, and state.modal.calendarNotes and return alertSuccess and the caseDetail returned from the use case', async () => {
    applicationContext
      .getUseCases()
      .addCaseToTrialSessionInteractor.mockReturnValue(MOCK_CASE);

    await runAction(addCaseToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: {
          calendarNotes: 'Test',
          trialSessionId: '234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCaseToTrialSessionInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCaseToTrialSessionInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      calendarNotes: 'Test',
      docketNumber: '123-45',
      trialSessionId: '234',
    });

    expect(successMock.mock.calls[0][0]).toMatchObject({
      alertSuccess: {},
      caseDetail: MOCK_CASE,
      docketNumber: '123-45',
      trialSessionId: '234',
    });
  });

  it('should take the error path if errors are found', async () => {
    applicationContext
      .getUseCases()
      .addCaseToTrialSessionInteractor.mockImplementation(() => {
        throw new Error();
      });

    await runAction(addCaseToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-19',
        },
        modal: {
          calendarNotes: 'Test',
          trialSessionId: '234',
        },
      },
    });

    expect(presenter.providers.path.success).not.toHaveBeenCalled();
    expect(presenter.providers.path.error).toHaveBeenCalled();
    expect(errorMock.mock.calls[0][0]).toMatchObject({
      alertError: {
        message: 'Please try again.',
        title: 'Case could not be added to trial session.',
      },
    });
  });
});
