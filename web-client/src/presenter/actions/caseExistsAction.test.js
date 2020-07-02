import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseExistsAction } from './caseExistsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('caseExistsAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('calls the interactor for fetching the case', async () => {
    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls.length,
    ).toEqual(1);
  });

  it('calls the success path when the interactor runs successfully', async () => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(MOCK_CASE);

    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('calls the error path when an error is encountered', async () => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockImplementation(() => {
        throw new Error('Nope!');
      });

    await runAction(caseExistsAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
