import { createWorkItemAction } from './createWorkItemAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let createWorkItemInteractorStub;

presenter.providers.applicationContext = {
  getUseCases: () => ({
    createWorkItemInteractor: createWorkItemInteractorStub,
  }),
};

const successStub = sinon.stub();

presenter.providers.path = {
  success: successStub,
};

describe('createWorkItemAction', () => {
  it('should call createWorkItemInteractor with the expected parameters for a message on props and call the success path when finished', async () => {
    createWorkItemInteractorStub = sinon.stub();

    await runAction(createWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        message: { assigneeId: '111', message: 'this is a test message' },
      },
      state: {
        caseDetail: {
          caseId: '222',
        },
        documentId: '333',
      },
    });

    expect(createWorkItemInteractorStub.called).toEqual(true);
    expect(createWorkItemInteractorStub.getCall(0).args[0]).toMatchObject({
      assigneeId: '111',
      caseId: '222',
      documentId: '333',
      message: 'this is a test message',
    });
    expect(successStub.called).toEqual(true);
    expect(successStub.getCall(0).args[0]).toHaveProperty('alertSuccess');
  });

  it('should call createWorkItemInteractor with the expected parameters for a message on state.form and call the success path when finished', async () => {
    createWorkItemInteractorStub = sinon.stub();

    await runAction(createWorkItemAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '456',
        },
        documentId: '789',
        form: {
          assigneeId: '123',
          message: 'this is a different test message',
        },
      },
    });

    expect(createWorkItemInteractorStub.called).toEqual(true);
    expect(createWorkItemInteractorStub.getCall(0).args[0]).toMatchObject({
      assigneeId: '123',
      caseId: '456',
      documentId: '789',
      message: 'this is a different test message',
    });
    expect(successStub.getCall(1).args[0]).toHaveProperty('alertSuccess');
  });
});
