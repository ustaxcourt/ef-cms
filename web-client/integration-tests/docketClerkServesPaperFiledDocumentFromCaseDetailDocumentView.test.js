import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkServesDocumentFromCaseDetailDocumentView } from './journey/docketClerkServesDocumentFromCaseDetailDocumentView';
import { docketClerkViewsCaseDetailDocumentView } from './journey/docketClerkViewsCaseDetailDocumentView';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk Serves Paper Filed Document From Case Detail Documents View', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
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

  loginAs(cerebralTest, 'docketclerk1@example.com');
  docketClerkAddsPaperFiledDocketEntryAndSavesForLater(cerebralTest, fakeFile);
  docketClerkServesDocumentFromCaseDetailDocumentView(cerebralTest);
  docketClerkViewsCaseDetailDocumentView(cerebralTest);
});
