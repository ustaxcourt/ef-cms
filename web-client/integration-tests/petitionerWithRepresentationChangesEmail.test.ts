import { docketClerkVerifiesQCItemNotInSectionInbox } from './journey/docketClerkVerifiesQCItemNotInSectionInbox';
import { loginAs, setupTest, uploadPetition, wait } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { userSuccessfullyUpdatesEmailAddress } from './journey/userSuccessfullyUpdatesEmailAddress';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';

describe('admissions clerk adds an email to a petitioner who already exists in the system and has a separate efile petition', () => {
  const cerebralTest = setupTest();

  const OLD_EMAIL = 'petitioner3@example.com';
  const NEW_EMAIL = 'petitioner5@example.com';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, OLD_EMAIL);
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, undefined, OLD_EMAIL);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  loginAs(cerebralTest, OLD_EMAIL);

  userSuccessfullyUpdatesEmailAddress(cerebralTest, 'petitioner', NEW_EMAIL);
  userVerifiesUpdatedEmailAddress(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('wait for notice to get processed on the async endpoint', async () => {
    await wait(5000);
  });

  const documentType = 'Notice of Change of Email Address';

  docketClerkVerifiesQCItemNotInSectionInbox(cerebralTest, documentType);
});
