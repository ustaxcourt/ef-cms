import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { sealCaseAction } from './sealCaseAction';

describe('sealCaseAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

  presenter.providers.applicationContext = applicationContext;

  const mockDocketNumber = '123-45';

  it('should call path.error when there is an error sealing the case', async () => {
    await applicationContext
      .getUseCases()
      .sealCaseInteractor.mockRejectedValue(new Error());

    await runAction(sealCaseAction, {
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

  it('should call sealCaseInteractor with state.caseDetail.docketNumber', async () => {
    await runAction(sealCaseAction, {
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
      applicationContext.getUseCases().sealCaseInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().sealCaseInteractor.mock.calls[0][1],
    ).toMatchObject({ docketNumber: mockDocketNumber });
  });

  it('should call path.success with the updated caseDetail and an alertSuccess.message', async () => {
    await applicationContext
      .getUseCases()
      .sealCaseInteractor.mockReturnValue(MOCK_CASE);

    await runAction(sealCaseAction, {
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
        message: 'Case sealed.',
      },
      caseDetail: MOCK_CASE,
    });
  });
});
