import { getShouldMarkReadAction } from './getShouldMarkReadAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const markReadStub = jest.fn();
const noActionStub = jest.fn();

presenter.providers.path = {
  markRead: markReadStub,
  noAction: noActionStub,
};

describe('getShouldMarkReadAction', () => {
  it('should return the markRead path if set', async () => {
    await runAction(getShouldMarkReadAction, {
      modules: {
        presenter,
      },
      props: {
        workItemIdToMarkAsRead: '123',
      },
    });
    expect(markReadStub.mock.calls.length).toEqual(1);
  });

  it('should return the noAction path if not set', async () => {
    await runAction(getShouldMarkReadAction, {
      modules: {
        presenter,
      },
      props: {
        workItemIdToMarkAsRead: null,
      },
    });
    expect(noActionStub.mock.calls.length).toEqual(1);
  });

  it('should set state.workItemId if props.workItemIdToMarkAsRead is set', async () => {
    const { state } = await runAction(getShouldMarkReadAction, {
      modules: {
        presenter,
      },
      props: {
        workItemIdToMarkAsRead: '123',
      },
    });
    expect(state.workItemId).toEqual('123');
  });
});
