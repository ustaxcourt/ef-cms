import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkEditsDocketEntryFromOrderTypeB } from '../integration-tests/journey/docketClerkEditsDocketEntryFromOrderTypeB';
import { docketClerkServesOrder } from '../integration-tests/journey/docketClerkServesOrder';
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

  loginAs(testClient, 'docketclerk');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient, 0);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkEditsDocketEntryFromOrderTypeB(testClient, 0);
  docketClerkServesOrder(testClient, 0);

  unauthedUserViewsTodaysOpinions(test);
});
