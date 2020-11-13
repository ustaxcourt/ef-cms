import { docketClerkAddsAndServesDocketEntryFromOrder } from './journey/docketClerkAddsAndServesDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { docketClerkViewsQCInProgress } from './journey/docketClerkViewsQCInProgress';
import { docketClerkViewsQCOutbox } from './journey/docketClerkViewsQCOutbox';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('Docket Clerk Document QC Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  test.draftOrders = [];

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 0);
  docketClerkSignsOrder(test, 0);
  docketClerkAddsAndServesDocketEntryFromOrder(test, 0);

  docketClerkViewsQCInProgress(test, false);
  docketClerkViewsQCOutbox(test, true);
});
