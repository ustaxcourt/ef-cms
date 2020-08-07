import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createWorkItemAction } from './createWorkItemAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createWorkItemAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call createWorkItemInteractor with the expected parameters for a message on props and return the alertSuccess', async () => {
    const result = await runAction(createWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        message: { assigneeId: '111', message: 'this is a test message' },
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        documentId: '333',
      },
    });

    expect(
      applicationContext.getUseCases().createWorkItemInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().createWorkItemInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      assigneeId: '111',
      docketNumber: '101-20',
      documentId: '333',
      message: 'this is a test message',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });

  it('should call createWorkItemInteractor with the expected parameters for a message on state.form and return the alertSuccess', async () => {
    const result = await runAction(createWorkItemAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        documentId: '789',
        form: {
          assigneeId: '123',
          message: 'this is a different test message',
        },
      },
    });

    expect(
      applicationContext.getUseCases().createWorkItemInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().createWorkItemInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      assigneeId: '123',
      docketNumber: '101-20',
      documentId: '789',
      message: 'this is a different test message',
    });
    expect(result.output).toHaveProperty('alertSuccess');
  });
});
