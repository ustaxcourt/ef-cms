import { getTrialSessionWorkingCopyAction } from './getTrialSessionWorkingCopyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

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
    getTrialSessionWorkingCopyStub = sinon.stub().resolves({
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
    expect(getTrialSessionWorkingCopyStub.calledOnce).toEqual(true);
    expect(
      getTrialSessionWorkingCopyStub.getCall(0).args[0].trialSessionId,
    ).toEqual('123');
  });
});
