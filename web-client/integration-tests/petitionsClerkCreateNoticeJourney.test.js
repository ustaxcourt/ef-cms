import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsDocketEntryFromOrder } from './journey/petitionsClerkAddsDocketEntryFromOrder';
import { petitionsClerkAddsNoticeToCase } from './journey/petitionsClerkAddsNoticeToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingNotice } from './journey/petitionsClerkViewsCaseDetailAfterAddingNotice';
import { petitionsClerkViewsDraftDocumentsForNotice } from './journey/petitionsClerkViewsDraftDocumentsForNotice';

const cerebralTest = setupTest();
describe('Petitions Clerk Create Notice Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkAddsNoticeToCase(cerebralTest);
  petitionsClerkViewsCaseDetailAfterAddingNotice(cerebralTest, 4);
  petitionsClerkViewsDraftDocumentsForNotice(cerebralTest, 1);
  petitionsClerkAddsDocketEntryFromOrder(cerebralTest);
});
