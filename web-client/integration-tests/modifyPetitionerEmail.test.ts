import { faker } from '@faker-js/faker';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { userLogsInAndChecksVerifiedEmailAddress } from './journey/userLogsInAndChecksVerifiedEmailAddress';
import { userSuccessfullyUpdatesEmailAddress } from './journey/userSuccessfullyUpdatesEmailAddress';
import { userUpdatesEmailAddressToOneAlreadyInUse } from './journey/userUpdatesEmailAddressToOneAlreadyInUse';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';

describe('Modify Petitioner Email', () => {
  const cerebralTest = setupTest();

  cerebralTest.createdDocketNumbers = [];

  let caseDetail;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner9@example.com');
  it('petitioner creates a case', async () => {
    caseDetail = await uploadPetition(
      cerebralTest,
      {},
      'petitioner9@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    await refreshElasticsearchIndex();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'petitioner9@example.com');
  userUpdatesEmailAddressToOneAlreadyInUse(cerebralTest, 'petitioner');

  const mockUpdatedEmail = `${faker.internet.userName()}_no_error@example.com`;
  userSuccessfullyUpdatesEmailAddress(
    cerebralTest,
    'petitioner',
    mockUpdatedEmail,
  );

  userVerifiesUpdatedEmailAddress(cerebralTest, 'petitioner');

  loginAs(cerebralTest, 'petitioner9@example.com');
  userLogsInAndChecksVerifiedEmailAddress(
    cerebralTest,
    'petitioner',
    mockUpdatedEmail,
  );
});
