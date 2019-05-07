import { presenter } from '../presenter';
import { setMessageAsReadAction } from './setMessageAsReadAction';
import { state } from 'cerebral';
import sinon from 'sinon';

let messageId = 123;
let setMessageAsReadStub = sinon.stub().returns(messageId);

let applicationContext = {
  getUseCases: () => ({
    setMessageAsRead: setMessageAsReadStub,
  }),
};

describe('setMessageAsReadAction', () => {
  it('should run setMessageAsReadAction on messageId', async () => {});
});
