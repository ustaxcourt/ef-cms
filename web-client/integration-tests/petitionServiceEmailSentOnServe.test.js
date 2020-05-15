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
    expect(emails.length).toEqual(1);
    expect(emails[0].template.replace(/<!-- -->/g, '')).toContain(
      `docketNumber: ${test.docketNumber}`,
    );
  });
});
