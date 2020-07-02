import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseExistsAndIsNotSealedAction } from './caseExistsAndIsNotSealedAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('caseExistsAndIsNotSealedAction', () => {
  const successMock = jest.fn();
  const errorMock = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('calls the interactor for fetching the case', async () => {
    await runAction(caseExistsAndIsNotSealedAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().getCaseForPublicDocketSearchInteractor
        .mock.calls.length,
    ).toEqual(1);
  });

  it('calls the success path when the interactor runs successfully and the case', async () => {
    applicationContext
      .getUseCases()
      .getCaseForPublicDocketSearchInteractor.mockReturnValue(MOCK_CASE);

    await runAction(caseExistsAndIsNotSealedAction, {
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
      .getCaseForPublicDocketSearchInteractor.mockImplementation(() => {
        throw new Error('Nope!');
      });

    await runAction(caseExistsAndIsNotSealedAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
