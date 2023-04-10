import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsDocketEntry } from '../integration-tests/journey/docketClerkSealsDocketEntry';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest as privateSetupTest,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('External user views case with sealed docket entry', () => {
  const testClient = privateSetupTest();

  afterAll(() => {
    testClient.closeSocket();
    testClient.draftOrders = [];
  });

  loginAs(testClient, 'petitioner@example.com');
  it('petitioner creates an electronic case', async () => {
    const { docketNumber } = await uploadPetition(testClient, {
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

    expect(docketNumber).toBeDefined();

    testClient.docketNumber = docketNumber;
  });

  loginAs(testClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(testClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(testClient);
  docketClerkAddsDocketEntryFromOrder(testClient, 0);
  docketClerkServesDocument(testClient, 0);
  docketClerkSealsDocketEntry(testClient, 0);

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);

  loginAs(testClient, 'privatepractitioner@example.com');
  it('verify sealed and served docket entry is not hyperlinked and a sealed icon displays for an unassociated practitioner', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(testClient);
    const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === testClient.draftOrders[0].docketEntryId,
    );

    expect(sealedDocketEntry.showDocumentDescriptionWithoutLink).toBe(true);
    expect(sealedDocketEntry.isSealed).toBe(true);
    expect(sealedDocketEntry.sealedToTooltip).toBe('Sealed to the public');
  });

  loginAs(testClient, 'petitionsclerk@example.com');

  petitionsClerkAddsPractitionersToCase(testClient, true);

  loginAs(testClient, 'privatepractitioner@example.com');

  it('verify sealed docket entry is hyperlinked for an associated practitioner', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(testClient);
    const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === testClient.draftOrders[0].docketEntryId,
    );
    expect(sealedDocketEntry.showDocumentDescriptionWithoutLink).toBe(false);
    expect(sealedDocketEntry.showLinkToDocument).toBe(true);
    expect(sealedDocketEntry.isSealed).toBe(true);
    expect(sealedDocketEntry.sealedToTooltip).toBe('Sealed to the public');
  });

  loginAs(testClient, 'docketclerk@example.com');
  it('verify sealed docket entry is hyperlinked', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(testClient);
    const sealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === testClient.draftOrders[0].docketEntryId,
    );
    expect(sealedDocketEntry.showDocumentDescriptionWithoutLink).toBe(false);
    expect(sealedDocketEntry.showDocumentViewerLink).toBe(true);
    expect(sealedDocketEntry.isSealed).toBe(true);
    expect(sealedDocketEntry.sealedToTooltip).toBe('Sealed to the public');
  });
});
