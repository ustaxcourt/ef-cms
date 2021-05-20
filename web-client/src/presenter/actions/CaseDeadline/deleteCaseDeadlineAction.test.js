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

  it('calls deleteCaseDeadlineInteractor', async () => {
    await runAction(deleteCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: mockDocketNumber },
        form: {
          caseDeadlineId: mockCaseDeadlineId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().deleteCaseDeadlineInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().deleteCaseDeadlineInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseDeadlineId: mockCaseDeadlineId,
      docketNumber: mockDocketNumber,
    });
  });

  it('calls the success path with alertSuccess.message', async () => {
    await runAction(deleteCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: mockDocketNumber },
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
