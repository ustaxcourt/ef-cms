import { getWorkItemAction } from './getWorkItemAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('getWorkItemAction', () => {
  it('should return the workItem', async () => {
    let getWorkItemInteractorStub = sinon.stub().returns({
      workItemId: 'work-item-1234',
    });

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getWorkItemInteractor: getWorkItemInteractorStub,
      }),
    };

    const result = await runAction(getWorkItemAction, {
      modules: {
        presenter,
      },
      props: {
        workItemId: 'work-item-1234',
      },
      state: {
        user: {
          token: 'user-token',
        },
      },
    });

    expect(result.output).toMatchObject({
      workItem: {
        workItemId: 'work-item-1234',
      },
    });
  });
});
