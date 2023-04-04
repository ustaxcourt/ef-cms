import { docketClerkAddsOpiniontoDocketyEntry } from '../integration-tests/journey/docketClerkAddsOpinionToDocketEntry';
import { docketClerkCreatesAnOpinion } from '../integration-tests/journey/docketClerkCreatesAnOpinion';
import { docketClerkSealsCase } from '../integration-tests/journey/docketClerkSealsCase';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import {
  fakeFile,
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { unauthedUserViewsTodaysOrders } from './journey/unauthedUserViewsTodaysOrders';
import { unauthedUserViewsTodaysOrdersOnSealedCase } from './journey/unauthedUserViewsTodaysOrdersOnSealedCase';

describe('Unauthed user views opinion pamphlets host page', () => {
  const cerebralTest = setupTest();
  const testClient = setupTestClient();
  const totalNumberOfDocuments = 4;

  beforeAll(() => {
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    testClient.closeSocket();
  });

  for (let i = 0; (i += 1); i <= totalNumberOfDocuments) {
    const formFieldValues = {
      documentTitle: `Pamphlet ${i}`,
      documentType: 'Tax Court Report Pamhplet',
      eventCode: 'TCRP',
      filingDate: `2023-${i}-01T05:00:00.000Z`,
      freeText: `Pamphlet ${i}`,
      scenario: 'Type A',
    };

    loginAs(testClient, 'petitioner@example.com');
    it(`Create test case ${i} and serves a TCRP on it`, async () => {
      const { docketNumber } = await uploadPetition(testClient);

      expect(docketNumber).toBeDefined();

      testClient.docketNumber = docketNumber;

      loginAs(testClient, 'docketclerk@example.com');
      loginAs(cerebralTest, 'docketclerk@example.com');
      docketClerkCreatesAnOpinion(cerebralTest, fakeFile);
      docketClerkAddsOpiniontoDocketyEntry(cerebralTest, i, formFieldValues);
      docketClerkServesDocument(cerebralTest, i);
    });
  }

  // unauthedUserViewsOpinionPamhplets(cerebralTest, testClient);
});
