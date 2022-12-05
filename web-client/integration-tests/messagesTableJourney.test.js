import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { loginAs, setupTest } from './helpers';

describe('messages table journey', () => {
  const cerebralTest = setupTest();
  const calendaredCaseDocketNumber = '103-20';

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

  // need to check that the properties trialLocation and trialDate are messages in:
  // My Inbox
  // Section Inbox
  // My Outbox
  // Section Outbox
  it('petitions clerk views case trial information on sent messages view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');
    console.log('***messages', messages);

    const foundMessage = messages.find(
      message => message.docketNumber === calendaredCaseDocketNumber,
    );

    //add checks for trial info
    expect(foundMessage).toMatchObject({
      caseStatus: CASE_STATUS_TYPES.calendared,
      docketNumber: calendaredCaseDocketNumber,
      trialDate: '2020-11-27T05:00:00.000Z',
      trialLocation: 'Houston, Texas',
    });
  });
});
