import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('ADC Clerk Views Section Messages Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  const message1Subject = `message 1 ${Date.now()}`;
  const message2Subject = `message 2 ${Date.now()}`;

  // Send some messages to ADC user(s)
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    subject: message1Subject,
    toSection: 'adc',
    toUserId: 'adc1',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    subject: message2Subject,
    toSection: 'adc',
    toUserId: 'adc1',
  });

  // Do sorting and validate:
  //    correct ordering
  //    correct icon direction
  //    correct column selection (i.e. underlining)
  //    correct handling of empty table
});
