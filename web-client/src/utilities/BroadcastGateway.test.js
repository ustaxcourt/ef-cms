import { BroadcastGateway } from './BroadcastGateway';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { clearNodeFolder, enforceOptions } from 'broadcast-channel';
import { waitUntil } from 'async-test-util';

describe('BroadcastGateway', () => {
  let broadcastGatewayA, broadcastGatewayB;
  let threadId;

  beforeAll(async () => {
    jest.setTimeout(10000);
    enforceOptions({
      type: 'simulate',
    });
    await clearNodeFolder();
    // jest.useFakeTimers(); // use with runAllTimers
  });

  beforeEach(() => {
    const channelName = applicationContext.getUniqueId();
    broadcastGatewayA = new BroadcastGateway({
      applicationContext,
      channelName,
    });
    broadcastGatewayB = new BroadcastGateway({
      applicationContext,
      channelName,
    });
  });
  afterEach(() => {
    broadcastGatewayA.close();
    broadcastGatewayB.close();
  });

  it('creates a gateway', () => {
    expect(broadcastGatewayA).toBeDefined();
  });

  it('IPC gateways send and receive messages on a thread id, but do NOT receive their own messages', async () => {
    const sendPromise = broadcastGatewayA.sendMessage({
      applicationContext,
      subject: 'bananas',
    });
    // jest.runAllTimers();
    threadId = await sendPromise;

    await waitUntil(() => broadcastGatewayB.messages.size === 1);
    expect(threadId).toBeDefined();

    const aMessagesPromise = broadcastGatewayA.getMessages({ threadId });
    const bMessagesPromise = broadcastGatewayB.getMessages({ threadId });
    // jest.runAllTimers();

    const aMessages = await aMessagesPromise;
    expect(aMessages.length).toBe(0);

    const bMessages = await bMessagesPromise;
    expect(bMessages.length).toBe(1);
  });

  it('IPC gateways clear messages', async () => {
    // A sends, B receives
    broadcastGatewayA.sendMessage({
      applicationContext,
      subject: 'oranges',
    });
    await waitUntil(() => broadcastGatewayB.messages.size === 1);

    // B sends, A receives
    await broadcastGatewayB.sendMessage({
      applicationContext,
      subject: 'apples',
    });
    await waitUntil(() => broadcastGatewayA.messages.size === 1);

    broadcastGatewayA.clearMessages();
    expect(broadcastGatewayA.messages.size).toBe(0);

    broadcastGatewayB.clearMessages();
    expect(broadcastGatewayB.messages.size).toBe(0);
  });

  it('fetches messages for a given threadId, removing from broadcastGateway set', async () => {
    threadId = await broadcastGatewayA.sendMessage({
      applicationContext,
      subject: 'apples',
    });
    await waitUntil(() => broadcastGatewayB.messages.size === 1);

    expect(broadcastGatewayB.messages.size).toBe(1);

    const messagesReceivedByB = await broadcastGatewayB.getMessages({
      threadId,
    });
    expect(messagesReceivedByB).toMatchObject(
      expect.arrayContaining([
        { sender: broadcastGatewayA.sender, subject: 'apples', threadId },
      ]),
    );
    expect(broadcastGatewayB.messages.size).toBe(0);
  });
});
