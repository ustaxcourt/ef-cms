import {
  deleteEmails,
  getEmailsForAddress,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const test = setupTest();

describe('Petition Service Email Sent on Serve', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkSubmitsCaseToIrs(test);

  it('should send the expected emails to irs super user', async () => {
    const emails = await getEmailsForAddress('irsSuperuserEmail@example.com');
    await deleteEmails(emails);
    emails.forEach(email => {
      email.template = email.template.replace(/<!-- -->/g, '');
    });
    const orderEmail = emails.find(
      email => email.template.indexOf('A new Petition has been served') !== -1,
    );
    expect(orderEmail.template.replace(/<!-- -->/g, '')).toContain(
      `docketNumber: ${test.docketNumber}`,
    );
  });
});
