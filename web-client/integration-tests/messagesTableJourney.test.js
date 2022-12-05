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

  it('petitions clerk views case trial information on sent messages view', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.docketNumber === cerebralTest.docketNumber,
    );

    //add checks for trial info
    expect(foundMessage).toMatchObject({
      caseStatus: CASE_STATUS_TYPES.calendared,
      docketNumber: calendaredCaseDocketNumber,
      trialDate: '',
      trialLocation: '',
    });
  });
});
