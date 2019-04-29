import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { verifyCaseForUserAction } from './verifyCaseForUserAction';
import sinon from 'sinon';

let verifyCaseForUserStub;

describe('verifyCaseForUser', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyCaseForUser: verifyCaseForUserStub,
      }),
    };

    presenter.providers.path = {
      error: sinon.stub(),
      success: sinon.stub(),
    };

    verifyCaseForUserStub = sinon.stub();
  });

  it('should set state.screenMetadata.caseOwnedByUser to true if case is owned by user', async () => {
    verifyCaseForUserStub.returns({ caseId: '123' });
    const { state } = await runAction(verifyCaseForUserAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
      },
    });

    expect(state.screenMetadata.caseOwnedByUser).toEqual(true);
  });

  it('should set state.screenMetadata.caseOwnedByUser to false if case is not owned by user', async () => {
    verifyCaseForUserStub.returns(null);
    const { state } = await runAction(verifyCaseForUserAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123' },
      },
    });

    expect(state.screenMetadata.caseOwnedByUser).toEqual(false);
  });
});
