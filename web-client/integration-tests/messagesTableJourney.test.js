import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../src/presenter/computeds/formattedMessageDetail';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  waitForCondition,
} from './helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

describe('messages table journey', () => {
  const cerebralTest = setupTest();
  const calendaredCaseDocketNumber = '103-20';
  const expectedMessageResult = {
    caseStatus: CASE_STATUS_TYPES.calendared,
    docketNumber: calendaredCaseDocketNumber,
    trialDate: '2020-11-27T05:00:00.000Z',
    trialLocation: 'Houston, Texas',
  };

  beforeAll(() => {
    jest.setTimeout(40000);
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

  it('petitions clerk 1 completes message', async () => {
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

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: cerebralTest.getState(),
    });
    expect(messageDetailFormatted.isCompleted).toEqual(true);

    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'Messages',
    });
  });
});
