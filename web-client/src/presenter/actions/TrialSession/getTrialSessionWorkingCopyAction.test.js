import { getTrialSessionWorkingCopyAction } from './getTrialSessionWorkingCopyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let getTrialSessionWorkingCopyStub;

describe('getTrialSessionWorkingCopyAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionWorkingCopyInteractor: getTrialSessionWorkingCopyStub,
      }),
    };
  });

  it('call the use case to get the trial session working copy', async () => {
    getTrialSessionWorkingCopyStub = jest.fn().mockResolvedValue({
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '234',
    });

    await runAction(getTrialSessionWorkingCopyAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: {},
    });
    expect(getTrialSessionWorkingCopyStub.mock.calls.length).toEqual(1);
    expect(
      getTrialSessionWorkingCopyStub.mock.calls[0][0].trialSessionId,
    ).toEqual('123');
  });
});
