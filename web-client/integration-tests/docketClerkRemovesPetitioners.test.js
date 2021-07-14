import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsPetitionerToCase } from './journey/docketClerkAddsPetitionerToCase';
import { docketClerkRemovesIntervenorFromCase } from './journey/docketClerkRemovesIntervenorFromCase';
import { docketClerkRemovesPetitionerFromCase } from './journey/docketClerkRemovesPetitionerFromCase';
import { docketClerkVerifiesPractitionerStillExistsOnCase } from './journey/docketClerkVerifiesPractitionerStillExistsOnCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk removes petitioners journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
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
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  const overrides = {
    contactType: 'intervenor',
    name: 'Test Intervenor',
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsPetitionerToCase(cerebralTest, overrides);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkRemovesIntervenorFromCase(cerebralTest);

  docketClerkVerifiesPractitionerStillExistsOnCase(cerebralTest);

  docketClerkRemovesPetitionerFromCase(cerebralTest);
});
