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

const test = setupTest();

describe('Modify Practitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;
  test.createdDocketNumbers = [];
  const practitionerEmail = 'privatePractitioner2@example.com';

  loginAs(test, practitionerEmail);
  it('practitioner creates a case', async () => {
    caseDetail = await uploadPetition(test, {}, practitionerEmail);
    expect(caseDetail.docketNumber).toBeDefined();

    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(test, 'practitioner');

  userSuccessfullyUpdatesEmailAddress(test, 'practitioner');

  userVerifiesUpdatedEmailAddress(test, 'practitioner');

  loginAs(test, practitionerEmail);
  userLogsInAndChecksVerifiedEmailAddress(test, 'practitioner');
});
