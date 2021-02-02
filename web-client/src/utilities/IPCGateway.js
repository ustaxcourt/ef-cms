import { BroadcastChannel } from 'broadcast-channel';

const BROADCAST_TIMEOUT_MS = 500;

export class IPCGateway {
  constructor({ applicationContext }) {
    this.sender = applicationContext.getUniqueId();
    this.messages = new Set();
    this.channelName = applicationContext.getConstants().CHANNEL_NAME;
    this.broadcastChannel = new BroadcastChannel(this.channelName);
    this.broadcastChannel.onmessage = message => {
      console.log("don't you want to go to your home?!", message);
      this.messages.add(message);
    };
  }

  toString() {
    return {
      channelName: this.channelName,
      messages: this.messages,
      sender: this.sender,
    };
  }

  clearMessages() {
    this.messages.clear();
  }

  filterMessages({ threadId }) {
    const matches = [];

    console.log('Filtering from set size', this.messages.size);
    this.messages.forEach(message => {
      console.log('HEY', message);
      if (threadId === undefined || message.threadId === threadId) {
        matches.push(message);
        this.messages.delete(message);
      }
    });

    return matches;
  }

  async getMessages({ threadId }) {
    console.log('ready');
    return new Promise(resolve => {
      console.log('set');
      setTimeout(() => {
        console.log('go!');
        resolve(this.filterMessages({ threadId }));
      }, BROADCAST_TIMEOUT_MS);
    });
  }

  sendMessage({ applicationContext, subject, threadId = undefined }) {
    const messageThreadId = threadId || applicationContext.getUniqueId();
    this.broadcastChannel.postMessage({
      sender: this.sender,
      subject,
      threadId: messageThreadId,
    });
    return messageThreadId;
  }
}
