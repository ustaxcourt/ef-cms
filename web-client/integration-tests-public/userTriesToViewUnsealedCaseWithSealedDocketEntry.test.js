import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsTranscriptDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsDocketEntry } from '../integration-tests/journey/docketClerkSealsDocketEntry';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';
import {
  loginAs,
  setupTest as privateSetupTest,
  uploadPetition,
} from '../integration-tests/helpers';
import { setupTest as publicSetupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';

describe('Unauthed user views todays orders', () => {
  const privateTestClient = privateSetupTest();
  const publicTestClient = publicSetupTest();

  privateTestClient.draftOrders = [];

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
  // upload a docket entry
  // add docket entry to docket record
  docketClerkAddsTranscriptDocketEntryFromOrder(privateTestClient, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });

  // seal a docket entry to the public
  docketClerkSealsDocketEntry(privateTestClient, 0);

  // view to public UI
  unauthedUserNavigatesToPublicSite(publicTestClient);

  // search for the case
  // unauthedUserSearchesByDocketNumber(privateTestClient, publicTestClient);

  // verify case shows up
  // verify no link is displayed for the sealed docket entry
});
