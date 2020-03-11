import { getJudgesCaseNoteForCaseAction } from './getJudgesCaseNoteForCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getUserCaseNoteStub;

describe('getJudgesCaseNoteForCaseAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getUserCaseNoteInteractor: getUserCaseNoteStub,
      }),
    };
  });

  it('call the use case to get the trial details', async () => {
    getUserCaseNoteStub = sinon.stub().resolves({
      note: '123',
    });

    await runAction(getJudgesCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { caseId: '123' } },
    });
    expect(getUserCaseNoteStub.calledOnce).toEqual(true);
    expect(getUserCaseNoteStub.getCall(0).args[0].caseId).toEqual('123');
  });
});
