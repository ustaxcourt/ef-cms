import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { addToTrialSessionAction } from './addToTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('addToTrialSessionAction', () => {
  const addCaseToTrialSessionInteractorSpy = jest
    .fn()
    .mockReturnValue(MOCK_CASE);

  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addCaseToTrialSessionInteractor: addCaseToTrialSessionInteractorSpy,
      }),
    };
  });

  it('should call the addCaseToTrialSessionInteractor with the state.caseDetail.caseId and state.modal.trialSessionId and return alertSuccess and the caseDetail returned from the use case', async () => {
    const result = await runAction(addToTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '123',
        },
        modal: {
          trialSessionId: '234',
        },
      },
    });

    expect(addCaseToTrialSessionInteractorSpy).toHaveBeenCalled();
    expect(addCaseToTrialSessionInteractorSpy.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      trialSessionId: '234',
    });
    expect(result.output).toHaveProperty('alertSuccess');
    expect(result.output.caseDetail).toEqual(MOCK_CASE);
  });
});
