import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setForHearingAction } from './setForHearingAction';

describe('setForHearingAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext
    .getUseCases()
    .setForHearingInteractor.mockResolvedValue();

  it('should call the setForHearingInteractor with the state.caseDetail.docketNumber and state.modal.trialSessionId and return alertSuccess', async () => {
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
    expect(result.output).toMatchObject({
      alertSuccess: { message: 'Case set for hearing.' },
    });
  });
});
