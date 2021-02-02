import { BroadcastChannel } from 'broadcast-channel';
import { uniqBy } from 'lodash';

const BROADCAST_TIMEOUT_MS = 500;

export class BroadcastGateway {
  constructor({ appInstanceId, channelName }) {
    this.sender = appInstanceId;
    this.messages = new Set();
    this.channelName = channelName;
    this.broadcastChannel = new BroadcastChannel(this.channelName);
    this.broadcastChannel.onmessage = this.handlerFactory(this);
    this.aggregateMessages = {};
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
   * handle incoming message on the channel
   *
   * @param {object} message
   * @returns {promise}
   */
  handlerFactory = _this => {
    return message => {
      //this.messages.add(message);

      switch (message.subject) {
        case 'idleStatusResponse':
          // gather all responses into an array
          _this.aggregateMessages[message.appInstanceId] = message;
          console.log('this aggregate messages', _this.aggregateMessages);
          break;
        case 'idleQuery':
          // todo: ask cerebral state for idle status
          break;
        default:
          console.log('unhandled message', message);
          break;
      }
    };
  };

  // async queryIdleStatus(message) {
  //   await this.sendMessage({
  //     subject: 'idleQuery',
  //     threadId: message.threadId,
  //   });

  //   return await this.getMessages({ threadId: message.threadId });
  // }

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
    //console.log('sendMessage: subject', subject);
    await this.broadcastChannel.postMessage({
      sender: this.sender,
      subject,
      threadId: messageThreadId,
    });
    //console.log({ messageThreadId });
    return messageThreadId;
  }

  async getIdleStatuses({ applicationContext }) {
    //console.log('getting idle statuses over channel', this.broadcastChannel);
    // post message with `idleStatus` to all instances
    await this.sendMessage({
      applicationContext,
      subject: 'idleStatus',
    });
    //const aggregateMessages = [];

    // this.broadcastChannel.onMessage = message => {
    //   console.log('response message', message);
    //   switch (message.subject) {
    //     case 'idleStatusResponse':
    //       // gather all responses into an array
    //       console.log('HOOORAY IT WORKED HEAR THE MESSAGE: ', message);
    //       aggregateMessages.push(message);
    //   }
    // };

    console.log('broadcastChannel on response', this.broadcastChannel);

    return new Promise(resolve => {
      // close the window, return the array
      const returnMessages = () => {
        // should we close() ?
        resolve(this.aggregateMessages);
      };

      // open a timed window where we listen for a response
      setTimeout(returnMessages, BROADCAST_TIMEOUT_MS);
    });
  }
}
