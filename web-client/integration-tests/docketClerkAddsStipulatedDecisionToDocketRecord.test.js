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

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk Adds Stipulated Decision to Docket Record', () => {
  const { STIPULATED_DECISION_EVENT_CODE } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsStipulatedDecisionDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner views Stipulated Decision on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(true);
  });

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  it('unassociated privatePractitioner views Stipulated Decision on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );
    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(false);
  });
});
