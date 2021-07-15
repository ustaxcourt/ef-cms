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

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case', () => {
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
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkSealsCase(cerebralTest);
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order for a sealed case',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);

  //verify that an internal user can still find this case via advanced search by name
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  associatedUserAdvancedSearchForSealedCase(cerebralTest);

  //associated users
  loginAs(cerebralTest, 'petitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(cerebralTest);
  associatedUserAdvancedSearchForSealedCase(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(cerebralTest);
  associatedUserAdvancedSearchForSealedCase(cerebralTest);

  //unassociated users
  loginAs(cerebralTest, 'privatePractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(cerebralTest);
  unassociatedUserAdvancedSearchForSealedCase(cerebralTest);
  externalUserSearchesForAnOrderOnSealedCase(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(cerebralTest);
  unassociatedUserAdvancedSearchForSealedCase(cerebralTest);
});
