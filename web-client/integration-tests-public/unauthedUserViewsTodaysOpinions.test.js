import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsOSTDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsOSTDocketEntryFromOrder';
import { docketClerkConvertsAnOrderToAnOpinion } from '../integration-tests/journey/docketClerkConvertsAnOrderToAnOpinion';
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
import { unauthedUserViewsTodaysOpinions } from './journey/unauthedUserViewsTodaysOpinions';
import { unauthedUserViewsTodaysOrdersWithoutBenchOpinion } from './journey/unauthedUserViewsTodaysOrdersWithoutBenchOpinion';

const cerebralTest = setupTest();
const testClient = setupTestClient();

testClient.draftOrders = [];

describe('Unauthed user views todays opinions', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');
  it('Create test case to add an opinion to', async () => {
    const caseDetail = await uploadPetition(testClient);
    expect(caseDetail.docketNumber).toBeDefined();
    testClient.docketNumber = caseDetail.docketNumber;
  });

  //  the next few tests create an order document, then edit it to convert
  //  it to an opinion type document, and then serve that opinion in order for it to show up in todays opinions
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient, 0);
  docketClerkSignsOrder(testClient, 0);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkConvertsAnOrderToAnOpinion(testClient, 0);
  docketClerkServesDocument(testClient, 0);

  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient, 1);
  docketClerkSignsOrder(testClient, 1);
  docketClerkAddsOSTDocketEntryFromOrder(testClient, 1);
  docketClerkServesDocument(testClient, 1);

  unauthedUserViewsTodaysOpinions(cerebralTest);
  unauthedUserViewsTodaysOrdersWithoutBenchOpinion(cerebralTest);

  // opinions for sealed cases should still be public
  loginAs(testClient, 'docketclerk@example.com');
  docketClerkSealsCase(testClient);

  unauthedUserViewsTodaysOpinions(cerebralTest);
});
