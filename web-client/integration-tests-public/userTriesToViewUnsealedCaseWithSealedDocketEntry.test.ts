import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { applicationContextPublic } from '../src/applicationContextPublic';
import { docketClerkAddsOrderDocketEntryFromOrder } from '../integration-tests/journey/docketClerkAddsOrderDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSealsDocketEntry } from '../integration-tests/journey/docketClerkSealsDocketEntry';
import { docketClerkServesDocument } from '../integration-tests/journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import { docketClerkUnsealsDocketEntry } from '../integration-tests/journey/docketClerkUnsealsDocketEntry';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';
import {
  loginAs,
  setupTest as privateSetupTest,
  uploadPetition,
} from '../integration-tests/helpers';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../src/presenter/computeds/Public/publicCaseDetailHelper';
import { setupTest as publicSetupTest } from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Unauthed user views todays orders', () => {
  const privateTestClient = privateSetupTest();
  const publicTestClient = publicSetupTest();

  afterAll(() => {
    privateTestClient.closeSocket();
    privateTestClient.draftOrders = [];
  });

  loginAs(privateTestClient, 'petitioner@example.com');
  it('petitioner creates an electronic case', async () => {
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
  });

  loginAs(privateTestClient, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(privateTestClient, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(privateTestClient);
  docketClerkSignsOrder(privateTestClient);
  docketClerkAddsOrderDocketEntryFromOrder(privateTestClient, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });
  docketClerkServesDocument(privateTestClient, 0);

  docketClerkSealsDocketEntry(privateTestClient, 0);

  unauthedUserNavigatesToPublicSite(publicTestClient);

  unauthedUserSearchesByDocketNumber(publicTestClient, privateTestClient);

  it('verify sealed docket entry is not hyperlinked and a sealed icon displays', async () => {
    await publicTestClient.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: publicTestClient.docketNumber,
    });

    const publicCaseDetailHelper = withAppContextDecorator(
      publicCaseDetailHelperComputed,
      applicationContextPublic,
    );

    const helper = runCompute(publicCaseDetailHelper, {
      state: publicTestClient.getState(),
    });

    const sealedDocketEntry = helper.formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.docketEntryId === privateTestClient.draftOrders[0].docketEntryId,
    )!;

    expect(sealedDocketEntry.showDocumentDescriptionWithoutLink).toBe(true);
    expect(sealedDocketEntry.showLinkToDocument).toBe(false);
    expect(sealedDocketEntry.isSealed).toBe(true);
    expect(sealedDocketEntry.sealedToTooltip).toBe('Sealed to the public');
  });

  docketClerkUnsealsDocketEntry(privateTestClient, 0);

  unauthedUserNavigatesToPublicSite(publicTestClient);
  unauthedUserSearchesByDocketNumber(publicTestClient, privateTestClient);

  it('verify unsealed docket entry is hyperlinked and a no sealed icon displays', async () => {
    await publicTestClient.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: publicTestClient.docketNumber,
    });

    const publicCaseDetailHelper = withAppContextDecorator(
      publicCaseDetailHelperComputed,
      applicationContextPublic,
    );

    const helper = runCompute(publicCaseDetailHelper, {
      state: publicTestClient.getState(),
    });

    const unsealedDocketEntry =
      helper.formattedDocketEntriesOnDocketRecord.find(
        entry =>
          entry.docketEntryId ===
          privateTestClient.draftOrders[0].docketEntryId,
      )!;

    expect(unsealedDocketEntry.showDocumentDescriptionWithoutLink).toBe(false);
    expect(unsealedDocketEntry.showLinkToDocument).toBe(true);
    expect(unsealedDocketEntry.isSealed).toBe(false);
    expect(unsealedDocketEntry.sealedToTooltip).toBeUndefined();
  });
});
