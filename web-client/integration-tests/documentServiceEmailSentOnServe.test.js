import {
  deleteEmails,
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

describe('Document Service Email Sent on Serve', () => {
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

  it('delete emails for petitioner', async () => {
    const emails = await getEmailsForAddress('petitioner');
    await deleteEmails(emails);
  });

  docketClerkServesOrder(test, 0);

  it('should send the expected emails for parties', async () => {
    const emails = await getEmailsForAddress('petitioner');
    expect(emails.length).toEqual(1);
    emails.forEach(email => {
      email.template = email.template.replace(/<!-- -->/g, '');
    });
    const orderEmail = emails.find(
      email =>
        email.template.indexOf(
          'Document Type: O Order which should send an email',
        ) !== -1,
    );
    expect(orderEmail.template.replace(/<!-- -->/g, '')).toContain(
      `Docket Number: ${test.docketNumber}`,
    );
  });
});
