// jest.mock('broadcast-channel');
// import { BroadcastChannel } from 'broadcast-channel';
import { IPCGateway } from './IPCGateway';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { clearNodeFolder, enforceOptions } from 'broadcast-channel';

describe('IPCGateway', () => {
  let ipcGatewayA, ipcGatewayB;
  let threadId;

  beforeAll(async () => {
    enforceOptions({
      type: 'simulate',
    });
    await clearNodeFolder();
    ipcGatewayA = new IPCGateway({ applicationContext });
    ipcGatewayB = new IPCGateway({ applicationContext });
    //jest.useFakeTimers(); // use with runAllTimers
  });

  beforeEach(() => {
    ipcGatewayA.clearMessages();
    ipcGatewayB.clearMessages();
  });

  it('creates a gateway', () => {
    expect(ipcGatewayA).toBeDefined();
  });

  it.only('IPC gateways send and receive messages on a thread id, but do NOT receive their own messages', async () => {
    threadId = ipcGatewayA.sendMessage({
      applicationContext,
      subject: 'bananas',
    });
    expect(threadId).toBeDefined();

    const aMessages = await ipcGatewayA.getMessages({ threadId });
    expect(aMessages.length).toBe(1);

    const bMessages = await ipcGatewayB.getMessages({ threadId });
    expect(bMessages.length).toBe(1);
  });

  it('IPC gateways clear messages', () => {
    ipcGatewayA.sendMessage({
      applicationContext,
      subject: 'oranges',
    });
    expect(ipcGatewayB.messages.size).toBe(1);

    ipcGatewayB.sendMessage({
      applicationContext,
      subject: 'apples',
    });
    expect(ipcGatewayA.messages.size).toBe(1);

    ipcGatewayA.clearMessages();
    expect(ipcGatewayA.messages.size).toBe(0);

    ipcGatewayB.clearMessages();
    expect(ipcGatewayB.messages.size).toBe(0);
  });

  it('fetches messages for a given threadId, removing from ipcGateway set', async () => {
    expect(ipcGatewayA.messages.size).toBe(0);
    expect(ipcGatewayB.messages.size).toBe(0);

    threadId = ipcGatewayA.sendMessage({
      applicationContext,
      subject: 'apples',
    });
    const messagesReceivedByB = ipcGatewayB.getMessages({ threadId });
    expect(messagesReceivedByB).toMatchObject(
      expect.arrayContaining([
        { sender: ipcGatewayA.sender, subject: 'apples', threadId },
      ]),
    );
  });
});
