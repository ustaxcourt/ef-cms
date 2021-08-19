import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setForHearingAction } from './setForHearingAction';

describe('setForHearingAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .setForHearingInteractor.mockReturnValue(MOCK_CASE);

  it('should call the setForHearingInteractor with the state.caseDetail.docketNumber and state.modal.trialSessionId and return alertSuccess and the caseDetail returned from the use case', async () => {
    const result = await runAction(setForHearingAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
        modal: {
          calendarNotes: 'calendarNotes',
          trialSessionId: '234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().setForHearingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setForHearingInteractor.mock.calls[0][1],
    ).toMatchObject({
      calendarNotes: 'calendarNotes',
      docketNumber: '123-45',
      trialSessionId: '234',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output.caseDetail).toEqual(MOCK_CASE);
    expect(result.output.docketNumber).toEqual('123-45');
    expect(result.output.trialSessionId).toEqual('234');
  });
});
