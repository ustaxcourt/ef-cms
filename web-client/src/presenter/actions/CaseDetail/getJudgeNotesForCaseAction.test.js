import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { getJudgeNotesForCaseAction } from './getJudgeNotesForCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getTrialSessionWorkingCopyStub;

describe('getJudgeNotesForCaseAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionWorkingCopyInteractor: getTrialSessionWorkingCopyStub,
      }),
    };
  });

  it('call the use case to get the judge notes from the trial session working copy', async () => {
    getTrialSessionWorkingCopyStub = sinon.stub().resolves({
      caseMetadata: {
        '101-18': {
          notes: 'hey!',
        },
      },
      sort: 'practitioner',
      sortOrder: 'desc',
      trialSessionId: '123',
      userId: '234',
    });

    const result = await runAction(getJudgeNotesForCaseAction, {
      modules: {
        presenter,
      },
      props: {
        trialSessionId: '123',
      },
      state: { caseDetail: { ...MOCK_CASE, trialSessionId: '123' } },
    });
    expect(getTrialSessionWorkingCopyStub.calledOnce).toEqual(true);
    expect(
      getTrialSessionWorkingCopyStub.getCall(0).args[0].trialSessionId,
    ).toEqual('123');
    expect(result.state.caseDetail.judgeNotes).toEqual('hey!');
  });
});
