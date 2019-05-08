import { setMessageAsReadAction } from './setMessageAsReadAction';
import sinon from 'sinon';

describe('setMessageAsReadAction', () => {
  let messageId;
  let get;
  let applicationContext;

  it('should set message as read', async () => {
    let setMessageAsReadStub = sinon.stub();

    messageId = 123;
    get = sinon.stub().returns(messageId);
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
