import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

const test = setupTest();

describe('Petitions Clerk Saves Document QC for Later', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeEach(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test, {
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
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkReviewsPetitionAndSavesForLater(test);
  petitionsClerkViewsSectionInProgress(test);
  petitionsClerkServesPetitionFromDocumentView(test);
});
