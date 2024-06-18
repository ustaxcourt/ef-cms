import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { formattedMessages as formattedMessagesComputed } from '../src/presenter/computeds/formattedMessages';
import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { userSendsMessage } from './journey/userSendsMessage';
import { withAppContextDecorator } from '../src/withAppContext';

describe('messages table journey', () => {
  const cerebralTest = setupTest();
  const calendaredCaseDocketNumber = '103-20';
  const expectedMessageResult = {
    caseStatus: CASE_STATUS_TYPES.calendared,
    docketNumber: calendaredCaseDocketNumber,
    trialDate: '2020-11-27T05:00:00.000Z',
    trialLocation: 'Houston, Texas',
  };
  const messageSubjectForJudge = 'Check your recent messages!';

  const judgesChambers = applicationContext
    .getPersistenceGateway()
    .getJudgesChambers();
  const judgeCohenUserId = 'dabbad04-18d0-43ec-bafb-654e83405416';

  const formattedMessages = withAppContextDecorator(formattedMessagesComputed);

  beforeAll(() => {
    jest.spyOn(
      cerebralTest.applicationContext.getUseCases(),
      'createMessageInteractor',
    );
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    docketNumber: calendaredCaseDocketNumber,
  });

  it('petitions clerk views case trial information from section sent messages view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'section',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === calendaredCaseDocketNumber,
    );

    expect(foundMessage).toMatchObject(expectedMessageResult);
  });

  it('petitions clerk views case trial information from individual sent messages view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === calendaredCaseDocketNumber,
    );

    expect(foundMessage).toMatchObject(expectedMessageResult);
  });

  loginAs(cerebralTest, 'petitionsclerk1@example.com');
  it('petitions clerk 1 views case trial information from messages individual inbox view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === calendaredCaseDocketNumber,
    );

    expect(foundMessage).toMatchObject(expectedMessageResult);
  });

  it('petitions clerk 1 views case trial information from messages section inbox view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === calendaredCaseDocketNumber,
    );

    expect(foundMessage).toMatchObject(expectedMessageResult);

    cerebralTest.messageId = foundMessage.messageId;
  });

  it('petitions clerk 1 completes message and views completed box with no errors', async () => {
    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: calendaredCaseDocketNumber,
      parentMessageId: cerebralTest.messageId,
    });

    await cerebralTest.runSequence('openCompleteMessageModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Completed message.',
    });

    await cerebralTest.runSequence('completeMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'completed',
      queue: 'my',
    });

    const completedMessagesFormatted = runCompute(formattedMessages, {
      state: cerebralTest.getState(),
    });

    const orignalMessage = completedMessagesFormatted.messages.find(
      m => m.messageId === cerebralTest.messageId,
    );

    expect(orignalMessage).toBeDefined();
  });

  it('petitions clerk 1 verifies the message is also in section completed', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'completed',
      queue: 'section',
    });

    const completedMessagesFormatted = runCompute(formattedMessages, {
      state: cerebralTest.getState(),
    });

    const orignalMessage = completedMessagesFormatted.messages.find(
      m => m.messageId === cerebralTest.messageId,
    );

    expect(orignalMessage).toBeDefined();
  });

  userSendsMessage(
    cerebralTest,
    messageSubjectForJudge,
    judgesChambers.COHENS_CHAMBERS_SECTION.section,
    judgeCohenUserId,
  );

  loginAs(cerebralTest, 'judgecohen@example.com');
  it('judge views recent messages with trial information', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('DashboardJudge');

    const messages = cerebralTest.getState('messages');

    const expectedMessage = messages.find(
      m => m.subject === messageSubjectForJudge,
    );

    expect(expectedMessage).toMatchObject(expectedMessageResult);
  });
});
