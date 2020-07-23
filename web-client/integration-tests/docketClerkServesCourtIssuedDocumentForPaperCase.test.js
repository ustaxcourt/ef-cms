import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrderWithPaperService } from './journey/docketClerkServesOrderWithPaperService';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetailAfterServingCourtIssuedDocument } from './journey/docketClerkViewsCaseDetailAfterServingCourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(test, 0);
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrderWithPaperService(test, 0);
  docketClerkViewsCaseDetailAfterServingCourtIssuedDocument(
    test,
    0,
    CASE_STATUS_TYPES.generalDocket,
  );
});
