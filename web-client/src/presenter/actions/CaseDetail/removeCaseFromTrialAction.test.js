import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeCaseFromTrialAction } from './removeCaseFromTrialAction';
import { runAction } from 'cerebral/test';

describe('removeCaseFromTrialAction', () => {
  const errorStub = jest.fn();
  const successStub = jest.fn();

  presenter.providers.applicationContext = applicationContext;
  presenter.providers.path = {
    error: errorStub,
    success: successStub,
  };

  const mockDocketNumber = '123-45';
  const mockTrialSessionId = '499d51ae-f118-4eb6-bd0e-f2c351df8f06';
  const mockDisposition = 'something';

  it('should call removeCaseFromTrialInteractor with case docketNumber and trialSessionId from state', async () => {
    await runAction(removeCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          trialSessionId: mockTrialSessionId,
        },
        modal: {
          disposition: mockDisposition,
        },
      },
    });

    expect(
      applicationContext.getUseCases().removeCaseFromTrialInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
      trialSessionId: mockTrialSessionId,
    });
    expect(successStub).toHaveBeenCalled();
  });

  it('should call removeCaseFromTrialInteractor with case docketNumber and trialSessionId from state.modal', async () => {
    await runAction(removeCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          disposition: mockDisposition,
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().removeCaseFromTrialInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
      trialSessionId: mockTrialSessionId,
    });
  });

  it('should return an alertSuccess and caseDetail', async () => {
    applicationContext
      .getUseCases()
      .removeCaseFromTrialInteractor.mockImplementationOnce(() => ({
        docketNumber: mockDocketNumber,
        trialSessionId: mockTrialSessionId,
      }));

    await runAction(removeCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          trialSessionId: mockTrialSessionId,
        },
        modal: {
          disposition: mockDisposition,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub).toHaveBeenCalledWith({
      alertSuccess: {
        message: 'Case removed from trial.',
      },
      caseDetail: {
        docketNumber: mockDocketNumber,
        trialSessionId: mockTrialSessionId,
      },
    });
  });

  it('should return an error if the interactor throws an exception', async () => {
    applicationContext
      .getUseCases()
      .removeCaseFromTrialInteractor.mockImplementationOnce(() => {
        throw new Error('error');
      });

    await runAction(removeCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          trialSessionId: mockTrialSessionId,
        },
        modal: {
          disposition: mockDisposition,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub).toHaveBeenCalledWith({
      alertError: {
        message: 'Please try again.',
        title: 'Case could not be removed from trial session.',
      },
    });
  });
});
