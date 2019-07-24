import { setWorkItemAsReadAction } from './setWorkItemAsReadAction';
import sinon from 'sinon';

describe('setWorkItemAsReadAction', () => {
  let get;
  let applicationContext;

  it('should set message as read', async () => {
    let setWorkItemAsReadStub = sinon.stub();
    get = sinon.stub();
    applicationContext = {
      getUseCases: () => ({
        setWorkItemAsReadInteractor: setWorkItemAsReadStub,
      }),
    };

    await setWorkItemAsReadAction({ applicationContext, get });

    expect(setWorkItemAsReadStub.calledOnce).toEqual(true);
    expect(get.calledOnce).toEqual(true);
  });
});
