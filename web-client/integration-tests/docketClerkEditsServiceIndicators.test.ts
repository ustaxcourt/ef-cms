import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsPetitionerInformation } from './journey/docketClerkEditsPetitionerInformation';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkEditsServiceIndicatorForPractitioner } from './journey/docketClerkEditsServiceIndicatorForPractitioner';
import { docketClerkEditsServiceIndicatorForRespondent } from './journey/docketClerkEditsServiceIndicatorForRespondent';
import { docketClerkServesOrderOnPaperParties } from './journey/docketClerkServesOrderOnPaperParties';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Docket Clerk edits service indicators for petitioner, practitioner, and respondent', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.draftOrders = [];
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates an electronic case', async () => {
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

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkEditsPetitionerInformation(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkEditsServiceIndicatorForPetitioner(cerebralTest);
  docketClerkEditsServiceIndicatorForPractitioner(cerebralTest);
  docketClerkEditsServiceIndicatorForRespondent(cerebralTest);
  // create an order to serve - it should be served to 3 paper service parties now
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesOrderOnPaperParties(cerebralTest, 0);
});
