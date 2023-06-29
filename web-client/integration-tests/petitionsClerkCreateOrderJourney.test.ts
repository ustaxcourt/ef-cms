import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsDocketEntryForOrderAndSavesForLater } from './journey/petitionsClerkAddsDocketEntryForOrderAndSavesForLater';
import { petitionsClerkAddsGenericOrderToCase } from './journey/petitionsClerkAddsGenericOrderToCase';
import { petitionsClerkAddsOrderToCase } from './journey/petitionsClerkAddsOrderToCase';
import { petitionsClerkCreatesMessageToChambers } from './journey/petitionsClerkCreatesMessageToChambers';
import { petitionsClerkEditsDraftOrder } from './journey/petitionsClerkEditsDraftOrder';
import { petitionsClerkEditsGenericOrder } from './journey/petitionsClerkEditsGenericOrder';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkSignsOrder } from './journey/petitionsClerkSignsOrder';
import { petitionsClerkViewsAddDocketEntryForGenericOrder } from './journey/petitionsClerkViewsAddDocketEntryForGenericOrder';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { petitionsClerkViewsCaseDetailAfterAddingOrder } from './journey/petitionsClerkViewsCaseDetailAfterAddingOrder';
import { petitionsClerkViewsDraftDocuments } from './journey/petitionsClerkViewsDraftDocuments';
import { petitionsDeletesOrderFromCase } from './journey/petitionsDeletesOrderFromCase';

describe('Petitions Clerk Create Order Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest);
  petitionsClerkAddsOrderToCase(cerebralTest);
  petitionsClerkViewsCaseDetailAfterAddingOrder(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest, 1);
  petitionsClerkEditsDraftOrder(cerebralTest, {});
  petitionsClerkViewsDraftDocuments(cerebralTest, 1);
  petitionsClerkEditsDraftOrder(cerebralTest, {
    currentRichText: '<p>This is an edited test order.</p>',
    setRichText: '<p>This is a re-edited test order</p>',
  });
  petitionsClerkCreatesMessageToChambers(cerebralTest);
  petitionsDeletesOrderFromCase(cerebralTest);
  petitionsClerkViewsDraftDocuments(cerebralTest, 0);

  petitionsClerkAddsGenericOrderToCase(cerebralTest);
  petitionsClerkSignsOrder(cerebralTest);
  petitionsClerkViewsAddDocketEntryForGenericOrder(cerebralTest);
  petitionsClerkEditsGenericOrder(cerebralTest);
  petitionsClerkSignsOrder(cerebralTest);
  petitionsClerkViewsAddDocketEntryForGenericOrder(cerebralTest);
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);
  petitionsClerkAddsDocketEntryForOrderAndSavesForLater(cerebralTest);
});
