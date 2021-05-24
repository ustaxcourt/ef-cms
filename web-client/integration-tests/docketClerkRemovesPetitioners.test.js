import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsPetitionerToCase } from './journey/docketClerkAddsPetitionerToCase';
import { docketClerkRemovesIntervenorFromCase } from './journey/docketClerkRemovesIntervenorFromCase';
import { docketClerkRemovesPetitionerFromCase } from './journey/docketClerkRemovesPetitionerFromCase';
import { docketClerkVerifiesPractitionerStillExistsOnCase } from './journey/docketClerkVerifiesPractitionerStillExistsOnCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk removes petitioners journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
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
  petitionsClerkServesElectronicCaseToIrs(test);

  const overrides = {
    contactType: 'intervenor',
    name: 'Test Intervenor',
  };

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsPetitionerToCase(test, overrides);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(test, true);

  loginAs(test, 'docketclerk@example.com');
  docketClerkRemovesIntervenorFromCase(test);

  docketClerkVerifiesPractitionerStillExistsOnCase(test);

  docketClerkRemovesPetitionerFromCase(test);
});
