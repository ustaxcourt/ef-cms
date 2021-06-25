import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { addCaseToTrialSessionAction } from './addCaseToTrialSessionAction';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('addCaseToTrialSessionAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .addCaseToTrialSessionInteractor.mockReturnValue(MOCK_CASE);

  it('should call the addCaseToTrialSessionInteractor with the state.caseDetail.docketNumber, state.modal.trialSessionId, and state.modal.calendarNotes and return alertSuccess and the caseDetail returned from the use case', async () => {
    const result = await runAction(addCaseToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: {
          calendarNotes: 'Test',
          trialSessionId: '234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCaseToTrialSessionInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().addCaseToTrialSessionInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      calendarNotes: 'Test',
      docketNumber: '123-45',
      trialSessionId: '234',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output.caseDetail).toEqual(MOCK_CASE);
    expect(result.output.docketNumber).toEqual('123-45');
    expect(result.output.trialSessionId).toEqual('234');
  });
});
