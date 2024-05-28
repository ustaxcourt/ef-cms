import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateCaseDeadlineAction } from '@web-client/presenter/actions/CaseDeadline/updateCaseDeadlineAction';

describe('updateCaseDeadlineAction', () => {
  const PATH = {
    error: jest.fn(),
    success: jest.fn(),
  };

  const mockedUpdateCaseDeadlineResult = 'mockedUpdateCaseDeadlineResult';

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .updateCaseDeadlineInteractor.mockImplementation(
        () => new Promise(resolve => resolve(mockedUpdateCaseDeadlineResult)),
      );

    Object.assign(presenter.providers, {
      applicationContext,
      path: PATH,
    });
  });

  it('should call updateCaseDeadlineInteractor with correct parameters', async () => {
    await runAction(updateCaseDeadlineAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          associatedJudge: 'TEST_ASSOCIATED_JUDGE',
          associatedJudgeId: 'TEST_ASSOCIATED_JUDGE_ID',
          docketNumber: 'TEST_DOCKET_NUMBER',
          leadDocketNumber: 'TEST_LEAD_DOCKET_NUMBER',
        },
        form: {
          formProp: 'TEST_FORM_PROP',
        },
      },
    });

    const successCalls = PATH.success.mock.calls;
    expect(successCalls.length).toEqual(1);
    expect(successCalls[0][0]).toEqual({
      alertSuccess: {
        message: 'Deadline updated.',
      },
      caseDeadline: mockedUpdateCaseDeadlineResult,
    });

    const updateCaseDeadlineInteractorCalls =
      applicationContext.getUseCases().updateCaseDeadlineInteractor.mock.calls;
    expect(updateCaseDeadlineInteractorCalls.length).toEqual(1);
    expect(updateCaseDeadlineInteractorCalls[0][1]).toEqual({
      caseDeadline: {
        associatedJudge: 'TEST_ASSOCIATED_JUDGE',
        associatedJudgeId: 'TEST_ASSOCIATED_JUDGE_ID',
        docketNumber: 'TEST_DOCKET_NUMBER',
        formProp: 'TEST_FORM_PROP',
        leadDocketNumber: 'TEST_LEAD_DOCKET_NUMBER',
      },
    });
  });
});
