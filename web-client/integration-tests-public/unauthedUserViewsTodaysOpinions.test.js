import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkConvertsAnOrderToAnOpinion } from '../integration-tests/journey/docketClerkConvertsAnOrderToAnOpinion';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';

import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { unauthedUserViewsTodaysOpinions } from './journey/unauthedUserViewsTodaysOpinions';

const test = setupTest();
const testClient = setupTestClient({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

testClient.draftOrders = [];

describe('Unauthed user views todays opinions', () => {
  loginAs(testClient, 'petitioner');
  it('Create test case to add an opinion to', async () => {
    const caseDetail = await uploadPetition(testClient);
    expect(caseDetail.docketNumber).toBeDefined();
    testClient.docketNumber = caseDetail.docketNumber;
  });

  //  the next few tests create an order document, then edit it to convert
  //  it to an opinion type document, and then serve that opinion in order for it to show up in todays opinions
  loginAs(testClient, 'docketclerk');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient, 0);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkConvertsAnOrderToAnOpinion(testClient, 0);
  docketClerkServesDocument(testClient, 0);

  unauthedUserViewsTodaysOpinions(test);
});
