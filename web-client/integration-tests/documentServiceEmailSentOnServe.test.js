import {
  getEmailsForAddress,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';
import { docketClerkViewsCaseDetailForCourtIssuedDocketEntry } from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe.skip('Document Service Email Sent on Serve', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order which should send an email',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  docketClerkViewsDraftOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrder(test, 0);

  it('should send the expected emails for parties', async () => {
    const emails = await getEmailsForAddress('petitioner');
    emails.forEach(email => {
      email.template = email.template.replace(/<!-- -->/g, '');
    });
    const orderEmail = emails.find(
      email =>
        email.template.indexOf(`Docket Number: ${test.docketNumber}`) !== -1 &&
        email.template.indexOf(
          'Document Type: O Order which should send an email',
        ) !== -1,
    );
    expect(orderEmail).toBeDefined();
  });
});
