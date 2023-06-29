import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserSkipSigningOrder } from './journey/chambersUserSkipSigningOrder';
import { chambersUserViewsCaseDetail } from './journey/chambersUserViewsCaseDetail';
import { chambersUserViewsDraftDocuments } from './journey/chambersUserViewsDraftDocuments';
import { loginAs, setupTest, uploadPetition } from './helpers';

describe('chambers user skips signing an order', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];
  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'colvinschambers@example.com');

  chambersUserViewsCaseDetail(cerebralTest, 2);
  chambersUserViewsDraftDocuments(cerebralTest);
  chambersUserAddsOrderToCase(cerebralTest);
  chambersUserSkipSigningOrder(cerebralTest);
});
