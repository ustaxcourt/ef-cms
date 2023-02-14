import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateSearchDeadlinesAction } from './validateSearchDeadlinesAction';

presenter.providers.applicationContext = applicationContext;

describe('validateSearchDeadlinesAction', () => {
  let successStub;
  let errorStub;

  let mockCaseDeadline;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateSearchDeadlinesInteractor.mockReturnValue(null);

    await runAction(validateSearchDeadlinesAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseDeadline,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateSearchDeadlinesInteractor.mockReturnValue('error');

    await runAction(validateSearchDeadlinesAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockCaseDeadline,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
