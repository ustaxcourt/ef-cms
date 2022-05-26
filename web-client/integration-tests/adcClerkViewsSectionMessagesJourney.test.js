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
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedMessagesComputed = withAppContextDecorator(
  formattedMessages,
  applicationContext,
);

const cerebralTest = setupTest();

describe('ADC Clerk Views Section Messages Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const testAdcId = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const petitionsClerkId = '4805d1ab-18d0-43ec-bafb-654e83405416';
  let beforeInboxMessageCount = 0;
  let beforeOutboxMessageCount = 0;
  let beforeCompletedMessageCount = 0;

  loginAs(cerebralTest, 'adc@example.com');
  it('get before counts for all section message boxes', async () => {
    beforeInboxMessageCount = await getUserMessageCount(
      cerebralTest,
      'inbox',
      'section',
    );
    beforeOutboxMessageCount = await getUserMessageCount(
      cerebralTest,
      'outbox',
      'section',
    );
    beforeCompletedMessageCount = await getUserMessageCount(
      cerebralTest,
      'completed',
      'section',
    );
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

  // Send some messages to ADC user(s)
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    subject: message1Subject,
    toSection: 'adc',
    toUserId: testAdcId,
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    subject: message2Subject,
    toSection: 'adc',
    toUserId: testAdcId,
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    subject: message3Subject,
    toSection: 'adc',
    toUserId: testAdcId,
  });

  loginAs(cerebralTest, 'adc@example.com');
  createNewMessageOnCase(cerebralTest, {
    subject: message4Subject,
    toSection: 'petitions',
    toUserId: petitionsClerkId,
  });

  createNewMessageOnCase(cerebralTest, {
    subject: message5Subject,
    toSection: 'petitions',
    toUserId: petitionsClerkId,
  });

  it('go to section inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
    });
  });

  it('verify default sorting of section inbox createdAt sort field, ascending', async () => {
    let afterInboxMessageCount = await getUserMessageCount(
      cerebralTest,
      'inbox',
      'section',
    );

    const { messages: inboxMessages } = runCompute(formattedMessagesComputed, {
      state: cerebralTest.getState(),
    });

    const expected = [message1Subject, message2Subject, message3Subject];

    expect(afterInboxMessageCount).toEqual(
      expected.length + beforeInboxMessageCount,
    );

    validateMessageOrdering(inboxMessages, expected);
  });

  it('verify default sorting of section outbox createdAt sort field, descending', async () => {
    let afterOutboxMessageCount = await getUserMessageCount(
      cerebralTest,
      'outbox',
      'section',
    );

    const { messages: outboxMessages } = runCompute(formattedMessagesComputed, {
      state: cerebralTest.getState(),
    });

    const expected = [message5Subject, message4Subject];

    expect(afterOutboxMessageCount).toEqual(
      expected.length + beforeOutboxMessageCount,
    );

    validateMessageOrdering(outboxMessages, expected);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  let message6SubjectFromState = '';
  let message7SubjectFromState = '';

  createNewMessageOnCase(cerebralTest, {
    subject: message6Subject,
    toSection: 'adc',
    toUserId: testAdcId,
  });
  it('get message6SubjectFromState', () => {
    message6SubjectFromState = cerebralTest.testMessageSubject;
  });

  createNewMessageOnCase(cerebralTest, {
    subject: message7Subject,
    toSection: 'adc',
    toUserId: testAdcId,
  });
  it('get message7SubjectFromState', () => {
    message7SubjectFromState = cerebralTest.testMessageSubject;
  });

  loginAs(cerebralTest, 'adc@example.com');
  it('adc clerk completes message threads', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const messages = cerebralTest.getState('messages');

    await markMessageAsComplete(
      cerebralTest,
      messages,
      message6Subject,
      message6SubjectFromState,
    );

    await markMessageAsComplete(
      cerebralTest,
      messages,
      message7Subject,
      message7SubjectFromState,
    );

    await refreshElasticsearchIndex();
  });

  it('verify default sorting of section completed completedAt sort field, descending', async () => {
    let afterCompletedMessageCount = await getUserMessageCount(
      cerebralTest,
      'completed',
      'section',
    );

    const { completedMessages } = runCompute(formattedMessagesComputed, {
      state: cerebralTest.getState(),
    });

    const expected = [message7SubjectFromState, message6SubjectFromState];

    expect(afterCompletedMessageCount).toEqual(
      expected.length + beforeCompletedMessageCount,
    );

    validateMessageOrdering(completedMessages, expected);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('verify the table headers are not clickable', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const { showSortableHeaders } = runCompute(formattedMessagesComputed, {
      state: cerebralTest.getState(),
    });

    expect(showSortableHeaders).toBeFalsy();
  });
});

const validateMessageOrdering = (actualMessages, expectedMessageSubjects) => {
  // Iterating over the inboxMessages array verifies that we
  // found the expected messages in the order we expected them to be.
  // The expectation on pointer verifies the count of expected messages.
  let pointer = 0;
  actualMessages.forEach(message => {
    if (message.subject === expectedMessageSubjects[pointer]) {
      pointer++;
    }
  });
  expect(pointer).toEqual(expectedMessageSubjects.length);
};

const markMessageAsComplete = async (
  context,
  messages,
  messageCompletedSubject,
  completedMessageSubject,
) => {
  const foundMessage = messages.find(
    message => message.subject === completedMessageSubject,
  );

  await context.runSequence('gotoMessageDetailSequence', {
    docketNumber: context.docketNumber,
    parentMessageId: foundMessage.parentMessageId,
  });

  await context.runSequence('openCompleteMessageModalSequence');

  await context.runSequence('updateModalValueSequence', {
    key: 'form.message',
    value: messageCompletedSubject,
  });

  await context.runSequence('completeMessageSequence');
};
