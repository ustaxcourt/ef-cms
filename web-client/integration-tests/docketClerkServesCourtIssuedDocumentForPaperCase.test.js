import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrderWithPaperService } from './journey/docketClerkServesOrderWithPaperService';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesOrderWithPaperService(cerebralTest, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(
    cerebralTest,
    0,
    CASE_STATUS_TYPES.generalDocket,
  );
});
