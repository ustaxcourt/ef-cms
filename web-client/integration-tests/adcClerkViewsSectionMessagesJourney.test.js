import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { userViewsMessages } from './journey/userViewsMessages';

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

  // Do sorting and validate:
  //    correct ordering
  //    correct icon direction
  //    correct column selection (i.e. underlining)
  //    correct handling of empty table
  //    Send messages from adc

  userViewsMessages(cerebralTest, 'inbox', 'section');
  it('verify default sorting of section inbox createdAt sort field', () => {
    const expectedMessageCount = 3;
    const inboxMessages = cerebralTest.getState('messages');
    const messageOne = { subject: message1Subject };
    const messageTwo = { subject: message2Subject };
    const messageThree = { subject: message3Subject };

    expect(inboxMessages.length).toEqual(expectedMessageCount);
    expect(inboxMessages).toEqual([
      expect.objectContaining(messageOne),
      expect.objectContaining(messageTwo),
      expect.objectContaining(messageThree),
    ]);
  });
});
