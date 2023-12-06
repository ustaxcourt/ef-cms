import { faker } from '@faker-js/faker';
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

describe('Modify Practitioner Email', () => {
  const cerebralTest = setupTest();

  cerebralTest.createdDocketNumbers = [];

  const practitionerEmail = 'privatepractitioner2@example.com';

  let caseDetail;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, practitionerEmail);
  it('practitioner creates a case', async () => {
    caseDetail = await uploadPetition(cerebralTest, {}, practitionerEmail);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
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
