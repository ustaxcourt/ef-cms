import { MESSAGE_QUEUE_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../src/applicationContext';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { formattedMessages } from '../src/presenter/computeds/formattedMessages';
import {
  getUserMessageCount,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { showSortableHeaders as showSortableHeadersComputed } from '../src/presenter/computeds/showSortableHeaders';
import { withAppContextDecorator } from '../src/withAppContext';

describe('ADC Clerk Views Messages Journey', () => {
  const cerebralTest = setupTest();

  const formattedMessagesComputed = withAppContextDecorator(
    formattedMessages,
    applicationContext,
  );
  beforeAll(() => {
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  MESSAGE_QUEUE_TYPES.forEach(messageQueue => {
    const testAdcId = '6805d1ab-18d0-43ec-bafb-654e83405416';
    const petitionsClerkId = '4805d1ab-18d0-43ec-bafb-654e83405416';
    let beforeInboxMessagesCount = 0;
    let beforeOutboxMessagesCount = 0;
    let beforeCompletedMessagesCount = 0;

    loginAs(cerebralTest, 'adc@example.com');
    it('get before counts for all section message boxes', async () => {
      const { messages: beforeInboxMessages } = await getUserMessageCount(
        cerebralTest,
        'inbox',
        messageQueue,
      );
      beforeInboxMessagesCount = beforeInboxMessages.length;

      const { messages: beforeOutboxMessages } = await getUserMessageCount(
        cerebralTest,
        'outbox',
        messageQueue,
      );
      beforeOutboxMessagesCount = beforeOutboxMessages.length;

      const { messages: beforeCompletedMessages } = await getUserMessageCount(
        cerebralTest,
        'completed',
        messageQueue,
      );
      beforeCompletedMessagesCount = beforeCompletedMessages.length;
    });

    loginAs(cerebralTest, 'petitioner@example.com');
    it('Create case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    const message1Subject = `message 1 ${Date.now()}`;
    const message2Subject = `message 2 ${Date.now()}`;
    const message3Subject = `message 3 ${Date.now()}`;
    const message4Subject = `message 4 ${Date.now()}`;
    const message5Subject = `message 5 ${Date.now()}`;
    const message6Subject = `message Completed 1 ${Date.now()}`;
    const message7Subject = `message Completed 2 ${Date.now()}`;

    let message1Id = null;
    let message2Id = null;
    let message3Id = null;
    let message4Id = null;
    let message5Id = null;
    let message6Id = null;
    let message7Id = null;

    // Send some messages to ADC user(s)
    loginAs(cerebralTest, 'petitionsclerk@example.com');
    createNewMessageOnCase(cerebralTest, {
      subject: message1Subject,
      toSection: 'adc',
      toUserId: testAdcId,
    });
    it('store the message 1 id', () => {
      message1Id = cerebralTest.lastCreatedMessage.messageId;
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    createNewMessageOnCase(cerebralTest, {
      subject: message2Subject,
      toSection: 'adc',
      toUserId: testAdcId,
    });
    it('store the message 2 id', () => {
      message2Id = cerebralTest.lastCreatedMessage.messageId;
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    createNewMessageOnCase(cerebralTest, {
      subject: message3Subject,
      toSection: 'adc',
      toUserId: testAdcId,
    });
    it('store the message 3 id', () => {
      message3Id = cerebralTest.lastCreatedMessage.messageId;
    });

    loginAs(cerebralTest, 'adc@example.com');
    createNewMessageOnCase(cerebralTest, {
      subject: message4Subject,
      toSection: 'petitions',
      toUserId: petitionsClerkId,
    });
    it('store the message 4 id', () => {
      message4Id = cerebralTest.lastCreatedMessage.messageId;
    });

    createNewMessageOnCase(cerebralTest, {
      subject: message5Subject,
      toSection: 'petitions',
      toUserId: petitionsClerkId,
    });
    it('store the message 5 id', () => {
      message5Id = cerebralTest.lastCreatedMessage.messageId;
    });

    it(`go to ${messageQueue} inbox`, async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: messageQueue,
      });
    });

    it(`verify default sorting of ${messageQueue} inbox createdAt sort field, ascending`, async () => {
      const { messages: inboxMessages } = await getUserMessageCount(
        cerebralTest,
        'inbox',
        messageQueue,
      );

      const afterInboxMessageCount = inboxMessages.length;

      const expected = [message1Id, message2Id, message3Id];

      expect(afterInboxMessageCount).toEqual(
        expected.length + beforeInboxMessagesCount,
      );

      validateMessageOrdering(inboxMessages, expected);
    });

    it(`go to ${messageQueue} outbox`, async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'outbox',
        queue: messageQueue,
      });
    });

    it(`verify default sorting of ${messageQueue} outbox createdAt sort field, descending`, async () => {
      const { messages: outboxMessages } = await getUserMessageCount(
        cerebralTest,
        'outbox',
        messageQueue,
      );

      const afterOutboxMessageCount = outboxMessages.length;

      const expected = [message5Id, message4Id];

      expect(afterOutboxMessageCount).toEqual(
        expected.length + beforeOutboxMessagesCount,
      );

      validateMessageOrdering(outboxMessages, expected);
    });

    it(`go to ${messageQueue} completed`, async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'completed',
        queue: messageQueue,
      });
    });

    loginAs(cerebralTest, 'docketclerk@example.com');

    createNewMessageOnCase(cerebralTest, {
      subject: message6Subject,
      toSection: 'adc',
      toUserId: testAdcId,
    });
    it('get message 6 id', () => {
      message6Id = cerebralTest.lastCreatedMessage.messageId;
    });

    createNewMessageOnCase(cerebralTest, {
      subject: message7Subject,
      toSection: 'adc',
      toUserId: testAdcId,
    });
    it('get message7SubjectFromState', () => {
      message7Id = cerebralTest.lastCreatedMessage.messageId;
    });

    loginAs(cerebralTest, 'adc@example.com');
    it('adc clerk completes message threads', async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: messageQueue,
      });

      const messages = cerebralTest.getState('messages');

      await markMessageAsComplete(cerebralTest, messages, message6Id);

      await markMessageAsComplete(cerebralTest, messages, message7Id);

      await refreshElasticsearchIndex();
    });

    it(`verify default sorting of ${messageQueue} completed box completedAt sort field, descending`, async () => {
      const { completedMessages } = await getUserMessageCount(
        cerebralTest,
        'completed',
        messageQueue,
      );

      let afterCompletedMessageCount = completedMessages.length;

      const expected = [message7Id, message6Id];

      expect(afterCompletedMessageCount).toEqual(
        expected.length + beforeCompletedMessagesCount,
      );

      validateMessageOrdering(completedMessages, expected);
    });

    loginAs(cerebralTest, 'docketclerk@example.com');
    it('verify the table headers are not clickable for non-ADC users', async () => {
      const showSortableHeaders = withAppContextDecorator(
        showSortableHeadersComputed,
      );

      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: messageQueue,
      });

      const isTableHeaderClickable = runCompute(showSortableHeaders, {
        state: cerebralTest.getState(),
      });

      expect(isTableHeaderClickable).toBe(false);
    });
    it('verify the messages in sent box are sorted from newest to oldest non-ADC users', async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'outbox',
        queue: messageQueue,
      });

      const { messages } = runCompute(formattedMessagesComputed, {
        state: cerebralTest.getState(),
      });

      const newSortedMessages = [...messages].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );

      expect(messages).toEqual(newSortedMessages);
    });
  });
});

const validateMessageOrdering = (actualMessages, expectedMessageIds) => {
  // Iterating over the inboxMessages array verifies that we
  // found the expected messages in the order we expected them to be.
  // The expectation on pointer verifies the count of expected messages.
  let pointer = 0;
  actualMessages.forEach(message => {
    if (message.messageId === expectedMessageIds[pointer]) {
      pointer++;
    }
  });
  expect(pointer).toEqual(expectedMessageIds.length);
};

const markMessageAsComplete = async (context, messages, messageId) => {
  const foundMessage = messages.find(
    message => message.messageId === messageId,
  );

  await context.runSequence('gotoMessageDetailSequence', {
    docketNumber: context.docketNumber,
    parentMessageId: foundMessage.parentMessageId,
  });

  await context.runSequence('openCompleteMessageModalSequence');

  await context.runSequence('updateModalValueSequence', {
    key: 'form.message',
    value: foundMessage.subject,
  });

  await context.runSequence('completeMessageSequence');
};
