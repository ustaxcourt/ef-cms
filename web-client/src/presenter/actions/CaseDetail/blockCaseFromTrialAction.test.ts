import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { blockCaseFromTrialAction } from './blockCaseFromTrialAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('blockCaseFromTrialAction', () => {
  const mockDocketNumber = '123-45';

  presenter.providers.applicationContext = applicationContext;

  it('should call the blockCaseFromTrialInteractor with the state.caseDetail.docketNumber, and state.modal.reason', async () => {
    await runAction(blockCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          reason: 'pending',
        },
      },
    });

    expect(
      applicationContext.getUseCases().blockCaseFromTrialInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().blockCaseFromTrialInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
      reason: 'pending',
    });
  });

  it('should return alertSuccess.message as props', async () => {
    const { output } = await runAction(blockCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          reason: 'pending',
        },
      },
    });

    expect(output.alertSuccess).toEqual({
      message: 'Case blocked from being set for trial.',
    });
  });
});
