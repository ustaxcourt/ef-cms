import { STIPULATED_DECISION_EVENT_CODE } from '../../shared/src/business/entities/EntityConstants';
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

describe('Docket Clerk Adds Stipulated Decision to Docket Record', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create electronic case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
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

  loginAs(cerebralTest, 'privatepractitioner@example.com');
  it('unassociated privatePractitioner views Stipulated Decision on docket record after policy change date', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);
    const stipulatedDecisionDocument =
      formattedDocketEntriesOnDocketRecord.find(
        document => document.eventCode === STIPULATED_DECISION_EVENT_CODE,
      );

    expect(stipulatedDecisionDocument.showLinkToDocument).toEqual(true);
  });
});
