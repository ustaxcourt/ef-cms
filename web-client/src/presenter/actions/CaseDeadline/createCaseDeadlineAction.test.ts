import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createCaseDeadlineAction } from './createCaseDeadlineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { MOCK_CASE } from '@shared/test/mockCase';

describe('createCaseDeadlineAction', () => {
  let successStub;

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should call createCaseDeadlineInteractor and set automatic blocked', async () => {
    const mockAutomaticBlocked = true;
    const mockAutomaticBlockedDate = '2019-11-11';
    const mockAutomaticBlockedReason = 'Because I said so';

    applicationContext
      .getUseCases()
      .createCaseDeadlineInteractor.mockReturnValue({
        ...MOCK_CASE,
        automaticBlocked: mockAutomaticBlocked,
        automaticBlockedDate: mockAutomaticBlockedDate,
        automaticBlockedReason: mockAutomaticBlockedReason,
      });

    const result = await runAction(createCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: MOCK_CASE.docketNumber,
          automaticBlocked: mockAutomaticBlocked,
          automaticBlockedDate: mockAutomaticBlockedDate,
          automaticBlockedReason: mockAutomaticBlockedReason,
        },
        form: {
          deadlineDate: MOCK_CASE_DEADLINE.deadlineDate,
          description: MOCK_CASE_DEADLINE.description,
        },
        user: {
          token: 'docketclerk',
        },
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
    expect(result.state.caseDetail.automaticBlocked).toEqual(
      mockAutomaticBlocked,
    );
    expect(result.state.caseDetail.automaticBlockedDate).toEqual(
      mockAutomaticBlockedDate,
    );
    expect(result.state.caseDetail.automaticBlockedReason).toEqual(
      mockAutomaticBlockedReason,
    );
  });
});
