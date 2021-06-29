import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { associatedUserAdvancedSearchForSealedCase } from './journey/associatedUserAdvancedSearchForSealedCase';
import { associatedUserViewsCaseDetailForSealedCase } from './journey/associatedUserViewsCaseDetailForSealedCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { externalUserSearchesForAnOrderOnSealedCase } from './journey/externalUserSearchesForAnOrderOnSealedCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserAdvancedSearchForSealedCase } from './journey/unassociatedUserAdvancedSearchForSealedCase';
import { unassociatedUserViewsCaseDetailForSealedCase } from './journey/unassociatedUserViewsCaseDetailForSealedCase';

const test = setupTest();
test.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case', () => {
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
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    console.log('new case docket#', caseDetail.docketNumber);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkSealsCase(test);
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order for a sealed case',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(test, 0);
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesDocument(test, 0);

  //verify that an internal user can still find this case via advanced search by name
  loginAs(test, 'petitionsclerk@example.com');
  associatedUserAdvancedSearchForSealedCase(test);

  //associated users
  loginAs(test, 'petitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(test);

  loginAs(test, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);

  loginAs(test, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(test);
  associatedUserAdvancedSearchForSealedCase(test);

  //unassociated users
  loginAs(test, 'privatePractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
  externalUserSearchesForAnOrderOnSealedCase(test);

  loginAs(test, 'irsPractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(test);
  unassociatedUserAdvancedSearchForSealedCase(test);
});
