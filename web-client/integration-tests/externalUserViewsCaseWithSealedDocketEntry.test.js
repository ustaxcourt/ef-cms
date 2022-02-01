import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsTranscriptDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsDocketEntry } from '../integration-tests/journey/docketClerkSealsDocketEntry';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';
import {
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest as privateSetupTest,
  uploadPetition,
} from '../integration-tests/helpers';

describe('Unauthed user views todays orders', () => {
  const testClient = privateSetupTest();

  testClient.draftOrders = [];

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    testClient.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');

  it('Create case', async () => {
    const caseDetail = await uploadPetition(testClient, {
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
    testClient.docketNumber = caseDetail.docketNumber;
  });

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(testClient, 0);
  docketClerkAddsTranscriptDocketEntryFromOrder(testClient, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });

  docketClerkSealsDocketEntry(testClient, 0);

  loginAs(testClient, 'privatePractitioner@example.com');
  it('verify sealed docket entry is not hyperlinked and a sealed icon displays', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(testClient);
    const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === testClient.draftOrders[0].docketEntryId,
    );
    expect(sealedDocketEntry.showDocumentDescriptionWithoutLink).toBe(true);
    expect(sealedDocketEntry.isSealed).toBe(true);
    expect(sealedDocketEntry.sealedToTooltip).toBe('Sealed to public');
  });
});
