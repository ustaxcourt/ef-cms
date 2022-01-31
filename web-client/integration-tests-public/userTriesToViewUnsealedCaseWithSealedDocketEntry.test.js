import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsTranscriptDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';
import {
  loginAs,
  setupTest as privateSetupTest,
  uploadPetition,
} from '../integration-tests/helpers';
// import { setupTest as publicSetupTest } from './helpers';
// const publicTestClient = publicSetupTest();
const privateTestClient = privateSetupTest();

privateTestClient.draftOrders = [];

describe('Unauthed user views todays orders', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    privateTestClient.closeSocket();
  });

  loginAs(privateTestClient, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(privateTestClient, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTINGPUBLIC',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    privateTestClient.docketNumber = caseDetail.docketNumber;
    privateTestClient.docketNumber = caseDetail.docketNumber;
  });

  // login as a docket clerk
  loginAs(privateTestClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(privateTestClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(privateTestClient, 0);
  // old transcript that should be available to the user
  docketClerkAddsTranscriptDocketEntryFromOrder(privateTestClient, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });

  // upload a docket entry
  // add docket entry to docket record
  // seal a docket entry to the public
  // view to public UI
  // search for the case
  // verify case shows up
  // verify no link is displayed for the sealed docket entry
});
