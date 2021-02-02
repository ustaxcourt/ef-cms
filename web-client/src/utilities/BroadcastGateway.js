import { BroadcastChannel } from 'broadcast-channel';

const BROADCAST_TIMEOUT_MS = 500;

export class BroadcastGateway {
  constructor({ appInstanceId, channelName }) {
    this.sender = appInstanceId;
    this.messages = new Set();
    this.channelName = channelName;
    this.broadcastChannel = new BroadcastChannel(this.channelName);
    this.broadcastChannel.onmessage = message => {
      this.messages.add(message);
    };
  }
  /**
   * clears all accumulated messages
   */
  clearMessages() {
    this.messages.clear();
  }

  /**
   * closes the broadcast channel, no more messages will be received
   */
  close() {
    this.broadcastChannel.close();
  }

  /**
   * iterates over accumulated messages in set, and any message whose
   * threadId matches the provided threadId will be added to the results, and the
   * message removed from the current messages set. Additionally, any message whose
   * threadId is undefined will also be returned.
   *
   * @returns Array<object> of messages
   */
  filterMessages({ threadId }) {
    const matches = [];
    this.messages.forEach(message => {
      if (threadId === undefined || message.threadId === threadId) {
        matches.push(message);
        this.messages.delete(message);
      }
    });

    return matches;
  }

  /**
   * waits for BROADCAST_TIMEOUT_MS to elapse, then
   * filters messages with requested thread ID
   *
   * @param {object} applicationContext the application context
   * @returns {Promise<Array>} filtered messages
   */
  async getMessages({ threadId }) {
    return await new Promise(resolve => {
      const filterMessages = () => {
        const filteredMessages = this.filterMessages({ threadId });
        resolve(filteredMessages);
      };
      setTimeout(filterMessages, BROADCAST_TIMEOUT_MS);
    });
  }

  async sendMessage({ applicationContext, subject, threadId = undefined }) {
    const messageThreadId = threadId || applicationContext.getUniqueId();
    await this.broadcastChannel.postMessage({
      sender: this.sender,
      subject,
      threadId: messageThreadId,
    });
    return messageThreadId;
  }
}
