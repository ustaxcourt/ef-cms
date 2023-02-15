import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { blockCaseFromTrialAction } from './blockCaseFromTrialAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('blockCaseFromTrialAction', () => {
  const mockDocketNumber = '123-45';

  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .addCaseToTrialSessionInteractor.mockReturnValue(MOCK_CASE);

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

  it('should return the updated caseDetail and alertSuccess.message as props', async () => {
    applicationContext
      .getUseCases()
      .blockCaseFromTrialInteractor.mockReturnValue(MOCK_CASE);

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

    expect(output.caseDetail).toEqual(MOCK_CASE);
    expect(output.alertSuccess).toEqual({
      message: 'Case blocked from being set for trial.',
    });
  });
});
