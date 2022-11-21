import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { unauthedUserViewsTodaysOrders } from '../integration-tests-public/journey/unauthedUserViewsTodaysOrders';
import { unauthedUserViewsTodaysOrdersOnSealedCase } from '../integration-tests-public/journey/unauthedUserViewsTodaysOrdersOnSealedCase';

describe('Unauthed user views todays orders', () => {
  const cerebralTest = setupTest();
  const testClient = setupTestClient();

  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    testClient.closeSocket();
    testClient.draftOrders = [];
  });

  loginAs(testClient, 'petitioner@example.com');
  it('Create test case to add an opinion to', async () => {
    const { docketNumber } = await uploadPetition(testClient);

    expect(docketNumber).toBeDefined();

    testClient.docketNumber = docketNumber;
  });

  loginAs(testClient, 'docketclerk@example.com');
  const uniqueDocumentTitle = 'Order to do something' + Date.now();
  cerebralTest.documentTitle1 = uniqueDocumentTitle;

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: uniqueDocumentTitle,
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient);
  docketClerkSignsOrder(testClient);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesDocument(testClient, 0);

  const uniqueDocumentTitle2 =
    'Order to do something a second time' + Date.now();
  cerebralTest.documentTitle2 = uniqueDocumentTitle2;
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: uniqueDocumentTitle2,
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient);
  docketClerkSignsOrder(testClient);
  docketClerkAddsDocketEntryFromOrder(testClient, 1);
  docketClerkServesDocument(testClient, 1);

  unauthedUserViewsTodaysOrders(cerebralTest, testClient);

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkSealsCase(testClient);

  unauthedUserViewsTodaysOrdersOnSealedCase(cerebralTest);
});
