import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setForHearingAction } from './setForHearingAction';

presenter.providers.applicationContext = applicationContext;

applicationContext
  .getUseCases()
  .setForHearingInteractor.mockReturnValue(MOCK_CASE);

describe('setForHearingAction', () => {
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
          note: 'note',
          trialSessionId: '234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().setForHearingInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setForHearingInteractor.mock.calls[0][0],
    ).toMatchObject({
      docketNumber: '123-45',
      note: 'note',
      trialSessionId: '234',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output.caseDetail).toEqual(MOCK_CASE);
    expect(result.output.docketNumber).toEqual('123-45');
    expect(result.output.trialSessionId).toEqual('234');
  });
});
