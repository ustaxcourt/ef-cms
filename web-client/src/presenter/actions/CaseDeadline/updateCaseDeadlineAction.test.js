import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlineFromFormAction } from './getCaseDeadlineFromFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateCaseDeadlineAction } from './updateCaseDeadlineAction';
jest.mock('./getCaseDeadlineFromFormAction');

describe('updateCaseDeadlineAction', () => {
  let successStub;

  const mockComputedDate = '2020-01-01T05:00:00.000Z';
  const mockDocketNumber = '999-21';
  const mockCaseDeadline = {
    associatedJudge: 'Judge Judy',
    deadlineDate: mockComputedDate,
    docketNumber: mockDocketNumber,
  };

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should call updateCaseDeadlineInteractor to update the caseDeadline', async () => {
    getCaseDeadlineFromFormAction.mockReturnValue(mockCaseDeadline);

    await runAction(updateCaseDeadlineAction, {
      modules: { presenter },
      props: {
        computedDate: mockComputedDate,
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseDeadlineInteractor.mock
        .calls[0][1].caseDeadline,
    ).toMatchObject({
      associatedJudge: 'Judge Judy',
      deadlineDate: mockComputedDate,
      docketNumber: mockDocketNumber,
    });
  });

  it('should return the success path with a message and the updated caseDeadline', async () => {
    applicationContext
      .getUseCases()
      .updateCaseDeadlineInteractor.mockReturnValue(mockCaseDeadline);
    getCaseDeadlineFromFormAction.mockReturnValue(mockCaseDeadline);

    await runAction(updateCaseDeadlineAction, {
      modules: { presenter },
      props: {
        computedDate: mockComputedDate,
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0].alertSuccess.message).toBe(
      'Deadline updated.',
    );
    expect(successStub.mock.calls[0][0].caseDeadline).toMatchObject(
      mockCaseDeadline,
    );
  });
});
