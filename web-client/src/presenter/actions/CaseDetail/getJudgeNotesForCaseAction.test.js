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

  it('does not call the use case to get the judge notes if the case does not have a trial session id', async () => {
    getTrialSessionWorkingCopyStub = sinon.stub().resolves(null);

    await runAction(getJudgeNotesForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { ...MOCK_CASE } },
    });
    expect(getTrialSessionWorkingCopyStub.calledOnce).toEqual(false);
  });

  it('does not set judge notes on the case detail if a working copy is not returned', async () => {
    getTrialSessionWorkingCopyStub = sinon.stub().resolves(null);

    const result = await runAction(getJudgeNotesForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { ...MOCK_CASE, trialSessionId: '123' } },
    });
    expect(getTrialSessionWorkingCopyStub.calledOnce).toEqual(true);
    expect(
      getTrialSessionWorkingCopyStub.getCall(0).args[0].trialSessionId,
    ).toEqual('123');
    expect(result.state.caseDetail.judgeNotes).toBeUndefined();
  });

  it('call the use case to get the judge notes from the trial session working copy and sets them on the case detail', async () => {
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
      state: { caseDetail: { ...MOCK_CASE, trialSessionId: '123' } },
    });
    expect(getTrialSessionWorkingCopyStub.calledOnce).toEqual(true);
    expect(
      getTrialSessionWorkingCopyStub.getCall(0).args[0].trialSessionId,
    ).toEqual('123');
    expect(result.state.caseDetail.judgeNotes).toEqual('hey!');
  });
});
