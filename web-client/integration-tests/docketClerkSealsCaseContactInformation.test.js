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

const test = setupTest();
test.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case contact information', () => {
  let contactType;

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
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;

    test.contactId = contactPrimaryFromState(test).contactId;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(test);

  loginAs(test, 'docketclerk@example.com');
  contactType = 'contactPrimary';
  docketClerkSealsContactInformation(test, contactType);
  docketClerkUpdatesSealedContactAddress(test, contactType);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(test, contactType);

  loginAs(test, 'docketclerk@example.com');
  contactType = 'contactSecondary';
  docketClerkSealsContactInformation(test, contactType);
  docketClerkUpdatesSealedContactAddress(test, contactType);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(test, contactType);
});
