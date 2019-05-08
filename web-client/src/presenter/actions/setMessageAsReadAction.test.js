import { setMessageAsReadAction } from './setMessageAsReadAction';
import sinon from 'sinon';

describe('setMessageAsReadAction', () => {
  let get;
  let applicationContext;

  it('should set message as read', async () => {
    let setMessageAsReadStub = sinon.stub();
    get = sinon.stub();
    applicationContext = {
      getUseCases: () => ({
        setMessageAsRead: setMessageAsReadStub,
      }),
    };

    await setMessageAsReadAction({ applicationContext, get });

    expect(setMessageAsReadStub.calledOnce).toEqual(true);
    expect(get.calledOnce).toEqual(true);
  });
});
