import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unblockCaseFromTrialAction } from './unblockCaseFromTrialAction';

describe('unblockCaseFromTrialAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockDocketNumber = '123-45';

  it('should call unblockCaseFromTrialInteractor with state.caseDetail.docketNumber', async () => {
    await runAction(unblockCaseFromTrialAction, {
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
      applicationContext.getUseCases().unblockCaseFromTrialInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().unblockCaseFromTrialInteractor.mock
        .calls[0][1],
    ).toMatchObject({ docketNumber: mockDocketNumber });
  });

  it('should return the updated caseDetail and an alertSuccess.message as props', async () => {
    await applicationContext
      .getUseCases()
      .unblockCaseFromTrialInteractor.mockReturnValue(MOCK_CASE);

    const { output } = await runAction(unblockCaseFromTrialAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(output).toMatchObject({
      alertSuccess: {
        message:
          'Block removed. Case is eligible for next available trial session.',
      },
      caseDetail: MOCK_CASE,
    });
  });
});
