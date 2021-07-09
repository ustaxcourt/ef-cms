import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { adcViewsPractitionerOnCaseAfterPetitionerRemoved } from './journey/adcViewsPractitionerOnCaseAfterPetitionerRemoved';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkEditsPetitionInQCPartyType } from './journey/petitionsClerkEditsPetitionInQCPartyType';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const test = setupTest();

describe('petitions clerk removes petitioner during petition QC', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'privatePractitioner@example.com');
  it('Create test case with a primary and secondary petitioner', async () => {
    const caseDetail = await uploadPetition(
      test,
      {
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
      },
      'privatePractitioner@example.com',
    );
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkEditsPetitionInQCPartyType(test);
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'adc@example.com');
  adcViewsPractitionerOnCaseAfterPetitionerRemoved(test);
});
