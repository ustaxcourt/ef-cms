import { judgeViewsCaseDetail } from './journey/judgeViewsCaseDetail';
import { judgeViewsDashboardMessages } from './journey/judgeViewsDashboardMessages';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { userSendsCaseMessageToJudge } from './journey/userSendsCaseMessageToJudge';

const test = setupTest();

describe('Judge messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  const message1Subject = `message 1 ${Date.now()}`;
  const message2Subject = `message 2 ${Date.now()}`;

  loginAs(test, 'petitionsclerk@example.com');
  userSendsCaseMessageToJudge(test, message1Subject);

  loginAs(test, 'docketclerk@example.com');
  userSendsCaseMessageToJudge(test, message2Subject);

  loginAs(test, 'judgeArmen@example.com');
  judgeViewsDashboardMessages(test, [message1Subject, message2Subject]);
  judgeViewsCaseDetail(test);
});
