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

const test = setupTest();
const testClient = setupTestClient();

testClient.draftOrders = [];

describe('Unauthed user views todays orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.draftOrders = [];
  });

  loginAs(testClient, 'petitioner@example.com');
  it('Create test case to add an opinion to', async () => {
    const caseDetail = await uploadPetition(testClient);
    expect(caseDetail.docketNumber).toBeDefined();
    testClient.docketNumber = caseDetail.docketNumber;
  });

  loginAs(testClient, 'docketclerk@example.com');
  const uniqueDocumentTitle = 'Order to do something' + Date.now();
  test.documentTitle = uniqueDocumentTitle;

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: uniqueDocumentTitle,
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient, 0);
  docketClerkSignsOrder(testClient, 0);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesDocument(testClient, 0);

  unauthedUserViewsTodaysOrders(test, testClient);

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkSealsCase(testClient);

  unauthedUserViewsTodaysOrdersOnSealedCase(test, testClient);
});
