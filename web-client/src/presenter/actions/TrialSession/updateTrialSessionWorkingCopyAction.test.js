import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateTrialSessionWorkingCopyAction } from './updateTrialSessionWorkingCopyAction';

let updateTrialSessionWorkingCopyStub;

describe('updateTrialSessionWorkingCopyAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateTrialSessionWorkingCopyInteractor: updateTrialSessionWorkingCopyStub,
      }),
    };
  });

  it('call the use case to get the trial session working copy', async () => {
    updateTrialSessionWorkingCopyStub = jest.fn().mockResolvedValue({
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '234',
    });

    await runAction(updateTrialSessionWorkingCopyAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionWorkingCopy: {
          sort: 'practitioner',
          sortOrder: 'desc',
          trialSessionId: '123',
          userId: '234',
        },
      },
    });
    expect(updateTrialSessionWorkingCopyStub.mock.calls.length).toEqual(1);
    expect(
      updateTrialSessionWorkingCopyStub.mock.calls[0][0]
        .trialSessionWorkingCopyToUpdate.trialSessionId,
    ).toEqual('123');
  });
});
