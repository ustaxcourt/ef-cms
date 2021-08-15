import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService } from './journey/docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService';
import { docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner } from './journey/docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkQCsNCAForCaseWithPaperService } from './journey/docketClerkQCsNCAForCaseWithPaperService';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerNavigatesToEditContact } from './journey/petitionerNavigatesToEditContact';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('noticeOfChangeOfAddressQCJourney', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
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
    expect(caseDetail.privatePractitioners).toEqual([]);
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);
  petitionsClerkAddsPractitionersToCase(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerNavigatesToEditContact(cerebralTest);
  petitionerEditsCasePrimaryContactAddress(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService(cerebralTest);
  docketClerkEditsServiceIndicatorForPetitioner(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkQCsNCAForCaseWithPaperService(cerebralTest);
});
