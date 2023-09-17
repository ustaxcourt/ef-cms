import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsealCaseAction } from './unsealCaseAction';

describe('unsealCaseAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

  presenter.providers.applicationContext = applicationContext;

  const mockDocketNumber = '123-45';

  it('should call path.error when there is an error unsealing the case', async () => {
    await applicationContext
      .getUseCases()
      .unsealCaseInteractor.mockRejectedValueOnce(new Error());

    await runAction(unsealCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should call unsealCaseInteractor with state.caseDetail.docketNumber', async () => {
    await runAction(unsealCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().unsealCaseInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().unsealCaseInteractor.mock.calls[0][1],
    ).toMatchObject({ docketNumber: mockDocketNumber });
  });

  it('should call path.success with the updated caseDetail and an alertSuccess.message', async () => {
    await applicationContext
      .getUseCases()
      .unsealCaseInteractor.mockReturnValue(MOCK_CASE);

    await runAction(unsealCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(pathSuccessStub.mock.calls[0][0]).toMatchObject({
      alertSuccess: {
        message: 'Case unsealed.',
      },
      caseDetail: MOCK_CASE,
    });
  });
});
