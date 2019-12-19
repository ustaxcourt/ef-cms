import { getJudgesCaseNoteForCaseAction } from './getJudgesCaseNoteForCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getJudgesCaseNoteStub;

describe('getJudgesCaseNoteForCaseAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getJudgesCaseNoteInteractor: getJudgesCaseNoteStub,
      }),
    };
  });

  it('call the use case to get the trial details', async () => {
    getJudgesCaseNoteStub = sinon.stub().resolves({
      note: '123',
    });

    await runAction(getJudgesCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { caseId: '123' } },
    });
    expect(getJudgesCaseNoteStub.calledOnce).toEqual(true);
    expect(getJudgesCaseNoteStub.getCall(0).args[0].caseId).toEqual('123');
  });
});
