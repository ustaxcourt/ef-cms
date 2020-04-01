import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { addCaseToTrialSessionAction } from './addCaseToTrialSessionAction';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

applicationContext
  .getUseCases()
  .addCaseToTrialSessionInteractor.mockReturnValue(MOCK_CASE);

describe('addCaseToTrialSessionAction', () => {
  it('should call the addCaseToTrialSessionInteractor with the state.caseDetail.caseId and state.modal.trialSessionId and return alertSuccess and the caseDetail returned from the use case', async () => {
    const result = await runAction(addCaseToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '123',
          docketNumber: '123-45',
        },
        modal: {
          trialSessionId: '234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCaseToTrialSessionInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCaseToTrialSessionInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '123',
      trialSessionId: '234',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output.caseDetail).toEqual(MOCK_CASE);
    expect(result.output.caseId).toEqual('123');
    expect(result.output.docketNumber).toEqual('123-45');
    expect(result.output.trialSessionId).toEqual('234');
  });
});
