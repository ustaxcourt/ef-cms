import { chambersUserAddsOrderToCase } from './journey/chambersUserAddsOrderToCase';
import { chambersUserSkipSigningOrder } from './journey/chambersUserSkipSigningOrder';
import { chambersUserViewsCaseDetail } from './journey/chambersUserViewsCaseDetail';
import { chambersUserViewsDraftDocuments } from './journey/chambersUserViewsDraftDocuments';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('chambers user skips signing an order', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'colvinsChambers@example.com');

  chambersUserViewsCaseDetail(cerebralTest, 2);
  chambersUserViewsDraftDocuments(cerebralTest);
  chambersUserAddsOrderToCase(cerebralTest);
  chambersUserSkipSigningOrder(cerebralTest);
});
