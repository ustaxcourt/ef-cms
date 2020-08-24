import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSealsContactPrimaryInformation } from './journey/docketClerkSealsContactPrimaryInformation';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();
test.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case contact information', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.contactId = caseDetail.contactPrimary.contactId;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkSealsContactPrimaryInformation(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerViewsCaseWithSealedContactInformation(test);
});
