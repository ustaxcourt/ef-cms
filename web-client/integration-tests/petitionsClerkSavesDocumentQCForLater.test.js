import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

const cerebralTest = setupTest();

describe('Petitions Clerk Saves Document QC for Later', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  petitionsClerkReviewsPetitionAndSavesForLater(cerebralTest);

  it('refresh elasticsearch index', async () => {
    await refreshElasticsearchIndex();
  });

  petitionsClerkViewsSectionInProgress(cerebralTest);
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);
});
