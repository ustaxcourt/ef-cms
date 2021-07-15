import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { userLogsInAndChecksVerifiedEmailAddress } from './journey/userLogsInAndChecksVerifiedEmailAddress';
import { userSuccessfullyUpdatesEmailAddress } from './journey/userSuccessfullyUpdatesEmailAddress';
import { userUpdatesEmailAddressToOneAlreadyInUse } from './journey/userUpdatesEmailAddressToOneAlreadyInUse';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';
import faker from 'faker';

const cerebralTest = setupTest();

describe('Modify Practitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;
  cerebralTest.createdDocketNumbers = [];
  const practitionerEmail = 'privatePractitioner2@example.com';

  loginAs(cerebralTest, practitionerEmail);
  it('practitioner creates a case', async () => {
    caseDetail = await uploadPetition(cerebralTest, {}, practitionerEmail);
    expect(caseDetail.docketNumber).toBeDefined();
    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(cerebralTest, 'practitioner');

  const mockUpdatedEmail = `${faker.internet.userName()}_no_error@example.com`;

  userSuccessfullyUpdatesEmailAddress(
    cerebralTest,
    'practitioner',
    mockUpdatedEmail,
  );

  userVerifiesUpdatedEmailAddress(cerebralTest, 'practitioner');

  loginAs(cerebralTest, practitionerEmail);
  userLogsInAndChecksVerifiedEmailAddress(
    cerebralTest,
    'practitioner',
    mockUpdatedEmail,
  );
});
