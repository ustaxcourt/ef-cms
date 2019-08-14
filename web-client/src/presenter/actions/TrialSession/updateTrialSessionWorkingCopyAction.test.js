import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateTrialSessionWorkingCopyAction } from './updateTrialSessionWorkingCopyAction';
import sinon from 'sinon';

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
    updateTrialSessionWorkingCopyStub = sinon.stub().resolves({
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
    expect(updateTrialSessionWorkingCopyStub.calledOnce).toEqual(true);
    expect(
      updateTrialSessionWorkingCopyStub.getCall(0).args[0]
        .trialSessionWorkingCopyToUpdate.trialSessionId,
    ).toEqual('123');
  });
});
