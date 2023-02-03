import { judgeViewsCaseDetail } from './journey/judgeViewsCaseDetail';
import { judgeViewsDashboardMessages } from './journey/judgeViewsDashboardMessages';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { userSendsMessage } from './journey/userSendsMessage';

describe('Judge messages journey', () => {
  const cerebralTest = setupTest();

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

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  userSendsMessage(cerebralTest, message1Subject);

  loginAs(cerebralTest, 'docketclerk@example.com');
  userSendsMessage(cerebralTest, message2Subject);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  judgeViewsDashboardMessages(cerebralTest, [message1Subject, message2Subject]);
  judgeViewsCaseDetail(cerebralTest);
});
