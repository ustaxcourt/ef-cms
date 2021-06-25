import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeCaseFromTrialAction } from './removeCaseFromTrialAction';
import { runAction } from 'cerebral/test';

describe('removeCaseFromTrialAction', () => {
  presenter.providers.applicationContext = applicationContext;

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
    const result = await runAction(removeCaseFromTrialAction, {
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

    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output).toHaveProperty('caseDetail');
  });
});
