import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateQcCompleteForTrialAction } from './updateQcCompleteForTrialAction';

let updateQcCompleteForTrialMock;
const successMock = jest.fn();
const errorMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

describe('updateQcCompleteForTrialAction', () => {
  beforeEach(() => {
    updateQcCompleteForTrialMock = jest.fn().mockResolvedValue(MOCK_CASE);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateQcCompleteForTrialInteractor: updateQcCompleteForTrialMock,
      }),
    };
  });

  it('goes to success path if case is updated', async () => {
    await runAction(updateQcCompleteForTrialAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: 'ce4fe698-e3d3-4b30-8925-c198a1955478',
        qcCompleteForTrial: true,
      },
      state: {
        trialSession: {
          trialSessionId: 'cf4531f3-8f12-4cb3-8a24-9741e64a49fe',
        },
      },
    });
    expect(successMock).toHaveBeenCalled();
  });

  it('goes to error path if the use case throws an error', async () => {
    updateQcCompleteForTrialMock = jest
      .fn()
      .mockRejectedValue(new Error('bad'));
    await runAction(updateQcCompleteForTrialAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: 'ce4fe698-e3d3-4b30-8925-c198a1955478',
        qcCompleteForTrial: true,
      },
      state: {
        trialSession: {
          trialSessionId: 'cf4531f3-8f12-4cb3-8a24-9741e64a49fe',
        },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });
});
