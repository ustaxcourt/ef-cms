import { createWorkItemAction } from './createWorkItemAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

let createWorkItemInteractorStub;

presenter.providers.applicationContext = {
  getUseCases: () => ({
    createWorkItemInteractor: createWorkItemInteractorStub,
  }),
};

describe('createWorkItemAction', () => {
  it('should call createWorkItemInteractor with the expected parameters for a message on props and return the alertSuccess', async () => {
    createWorkItemInteractorStub = jest.fn();

    const result = await runAction(createWorkItemAction, {
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

    expect(createWorkItemInteractorStub).toBeCalled();
    expect(createWorkItemInteractorStub.mock.calls[0][0]).toMatchObject({
      assigneeId: '111',
      caseId: '222',
      documentId: '333',
      message: 'this is a test message',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });

  it('should call createWorkItemInteractor with the expected parameters for a message on state.form and return the alertSuccess', async () => {
    createWorkItemInteractorStub = jest.fn();

    const result = await runAction(createWorkItemAction, {
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

    expect(createWorkItemInteractorStub).toBeCalled();
    expect(createWorkItemInteractorStub.mock.calls[0][0]).toMatchObject({
      assigneeId: '123',
      caseId: '456',
      documentId: '789',
      message: 'this is a different test message',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });
});
