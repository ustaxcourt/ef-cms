import { getCaseNoteForCaseAction } from './getCaseNoteForCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getCaseNoteStub;

describe('getCaseNoteForCaseAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getCaseNoteInteractor: getCaseNoteStub,
      }),
    };
  });

  it('call the use case to get the trial details', async () => {
    getCaseNoteStub = sinon.stub().resolves({
      note: '123',
    });

    await runAction(getCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { caseId: '123' } },
    });
    expect(getCaseNoteStub.calledOnce).toEqual(true);
    expect(getCaseNoteStub.getCall(0).args[0].caseId).toEqual('123');
  });
});
