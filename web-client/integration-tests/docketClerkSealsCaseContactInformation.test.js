import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { docketClerkSealsContactInformation } from './journey/docketClerkSealsContactInformation';
import { docketClerkUpdatesSealedContactAddress } from './journey/docketClerkUpdatesSealedContactAddress';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkViewsCaseWithSealedContact } from './journey/petitionsClerkViewsCaseWithSealedContact';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case contact information', () => {
  let contactType;

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
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;

    cerebralTest.contactId = contactPrimaryFromState(cerebralTest).contactId;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  contactType = 'contactPrimary';
  docketClerkSealsContactInformation(cerebralTest, contactType);
  docketClerkUpdatesSealedContactAddress(cerebralTest, contactType);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(cerebralTest, contactType);

  loginAs(cerebralTest, 'docketclerk@example.com');
  contactType = 'contactSecondary';
  docketClerkSealsContactInformation(cerebralTest, contactType);
  docketClerkUpdatesSealedContactAddress(cerebralTest, contactType);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(cerebralTest, contactType);
});
