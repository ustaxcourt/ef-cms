import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewMessageOnCase } from './journey/petitionsClerkCreatesNewMessageOnCase';
import { petitionsClerkViewsSentMessagesBox } from './journey/petitionsClerkViewsSentMessagesBox';

const test = setupTest();

describe('messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(test, 'petitioner');
  it('Create test case to send messages', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.documentId = caseDetail.documents[0].documentId;
    test.caseId = caseDetail.caseId;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewMessageOnCase(test);
  petitionsClerkViewsSentMessagesBox(test);

  loginAs(test, 'petitionsclerk1');
  petitionsClerk1ViewsMessageInbox(test);
});
