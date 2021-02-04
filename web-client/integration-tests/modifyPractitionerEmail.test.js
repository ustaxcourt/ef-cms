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

  loginAs(test, 'privatePractitioner2@example.com');
  it('practitioner creates a case', async () => {
    caseDetail = await uploadPetition(
      test,
      {},
      'privatePractitioner2@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();

    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(test, 'practitioner');

  userSuccessfullyUpdatesEmailAddress(test, 'practitioner');

  userVerifiesUpdatedEmailAddress(test, 'practitioner');

  loginAs(test, 'privatePractitioner2@example.com');
  userLogsInAndChecksVerifiedEmailAddress(test, 'practitioner');
});
