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

describe('Modify Petitioner Email', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  let caseDetail;
  cerebralTest.createdDocketNumbers = [];

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates a case', async () => {
    caseDetail = await uploadPetition(
      cerebralTest,
      {},
      'petitioner@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();

    await refreshElasticsearchIndex();
  });

  userUpdatesEmailAddressToOneAlreadyInUse(cerebralTest, 'petitioner');

  const mockUpdatedEmail = `${faker.internet.userName()}_no_error@example.com`;
  userSuccessfullyUpdatesEmailAddress(
    cerebralTest,
    'petitioner',
    mockUpdatedEmail,
  );

  userVerifiesUpdatedEmailAddress(cerebralTest, 'petitioner');

  loginAs(cerebralTest, 'petitioner@example.com');
  userLogsInAndChecksVerifiedEmailAddress(
    cerebralTest,
    'petitioner',
    mockUpdatedEmail,
  );
});
