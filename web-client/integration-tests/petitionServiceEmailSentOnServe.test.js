import { loginAs, setupTest } from './helpers';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { deleteEmails, getEmailsForAddress, uploadPetition } from './helpers';

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
    console.log(emails.length);
    expect(emails.length).toEqual(1);
    expect(emails[0].template.replace(/<!-- -->/g, '')).toContain(
      `docketNumber: ${test.docketNumber}`,
    );
  });
});
