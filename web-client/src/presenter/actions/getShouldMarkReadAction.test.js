import { getShouldMarkReadAction } from './getShouldMarkReadAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

const markReadStub = sinon.stub();
const noActionStub = sinon.stub();

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
        markWorkItemRead: '123r',
      },
    });
    expect(markReadStub.calledOnce).toEqual(true);
  });

  it('should return the noAction path if not set', async () => {
    await runAction(getShouldMarkReadAction, {
      modules: {
        presenter,
      },
      props: {
        markWorkItemRead: null,
      },
    });
    expect(noActionStub.calledOnce).toEqual(true);
  });

  it('should set state.workItemId if props.markWorkItemRead is set', async () => {
    const { state } = await runAction(getShouldMarkReadAction, {
      modules: {
        presenter,
      },
      props: {
        markWorkItemRead: '123',
      },
    });
    expect(state.workItemId).toEqual('123');
  });
});
