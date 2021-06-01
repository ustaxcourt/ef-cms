import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerk1ServesDocumentFromMessageDetail } from './journey/petitionsClerk1ServesDocumentFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';

const test = setupTest();
test.draftOrders = [];

describe('Petitions Clerk Serves Paper Filed Document From Message Detail', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk1@example.com');
  docketClerkAddsPaperFiledDocketEntryAndSavesForLater(test, fakeFile);
  createNewMessageOnCase(test);

  loginAs(test, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(test);
  petitionsClerk1ViewsMessageDetail(test);
  petitionsClerk1ServesDocumentFromMessageDetail(test);
});
