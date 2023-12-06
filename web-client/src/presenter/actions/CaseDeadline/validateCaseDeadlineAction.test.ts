import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCaseDeadlineAction } from './validateCaseDeadlineAction';

presenter.providers.applicationContext = applicationContext;

describe('validateCaseDeadlineAction', () => {
  let successStub;
  let errorStub;

  let mockCaseDeadline, mockCaseDetail;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockCaseDeadline = {
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'hello world',
      docketNumber: '123-20',
    };

    mockCaseDetail = {
      associatedJudge: 'Buch',
      docketNumber: '123-20',
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDeadlineInteractor.mockReturnValue(null);

    await runAction(validateCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockCaseDetail,
        form: mockCaseDeadline,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCaseDeadlineInteractor.mockReturnValue('error');

    await runAction(validateCaseDeadlineAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: mockCaseDetail,
        form: mockCaseDeadline,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
