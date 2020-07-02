import {
  getEmailsForAddress,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const test = setupTest();

describe.skip('Petition Service Email Sent on Serve', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
    test.documentId = caseDetail.documents.find(
      d => d.documentType === 'Petition',
    ).documentId;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkSubmitsCaseToIrs(test);

  it('should send the expected emails to irs super user', async () => {
    const emails = await getEmailsForAddress('irsSuperuserEmail@example.com');
    emails.forEach(email => {
      email.template = email.template.replace(/<!-- -->/g, '');
    });
    const orderEmail = emails.find(
      email =>
        email.template.indexOf(`docketNumber: ${test.docketNumber}`) !== -1 &&
        email.template.indexOf('A new Petition has been served') !== -1 &&
        email.template.indexOf(`documentId: ${test.documentId}`) !== -1,
    );
    expect(orderEmail).toBeDefined();
  });
});
