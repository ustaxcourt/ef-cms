import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { associatedUserAdvancedSearchForCase } from './journey/associatedUserAdvancedSearchForCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUnsealsCase } from './journey/docketClerkUnsealsCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserAdvancedSearchForUnsealedCase } from './journey/unassociatedUserAdvancedSearchForUnsealedCase';
import { unassociatedUserViewsCaseDetailForUnsealedCase } from './journey/unassociatedUserViewsCaseDetailForUnsealedCase';

describe('Docket Clerk unseals a case', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
    cerebralTest.draftOrders = [];
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner create an electronic case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest, {
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

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
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
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocument(cerebralTest, 0);
  docketClerkUnsealsCase(cerebralTest);

  //verify that an internal user can still find this case via advanced search by name
  loginAs(cerebralTest, 'petitionsclerk@example.com');
  associatedUserAdvancedSearchForCase(cerebralTest);

  //unassociated user can still find the case
  loginAs(cerebralTest, 'privatepractitioner3@example.com');
  unassociatedUserViewsCaseDetailForUnsealedCase(cerebralTest);
  unassociatedUserAdvancedSearchForUnsealedCase(cerebralTest);
});
