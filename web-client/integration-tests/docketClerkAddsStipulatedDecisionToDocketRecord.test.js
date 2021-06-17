import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsStipulatedDecisionDocketEntryFromOrder } from './journey/docketClerkAddsStipulatedDecisionDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import {
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Stipulated Decision to Docket Record', () => {
  const { STIPULATED_DECISION_EVENT_CODE } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
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
  docketClerkAddsStipulatedDecisionDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);

  loginAs(test, 'petitioner@example.com');
  it('petitioner views Stipulated Decision on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(true);
  });

  loginAs(test, 'privatePractitioner@example.com');
  it('unassociated privatePractitioner views Stipulated Decision on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(false);
  });
});
