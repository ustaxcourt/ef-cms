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

describe('Modify Petitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  let caseDetail;
  test.createdDocketNumbers = [];

  loginAs(test, 'petitioner@example.com');
  it('petitioner creates a case', async () => {
    caseDetail = await uploadPetition(test, {}, 'petitioner@example.com');
    expect(caseDetail.docketNumber).toBeDefined();

    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(test, 'petitioner');

  userSuccessfullyUpdatesEmailAddress(test, 'petitioner');

  userVerifiesUpdatedEmailAddress(test, 'petitioner');

  loginAs(test, 'petitioner@example.com');
  userLogsInAndChecksVerifiedEmailAddress(test, 'petitioner');
});
