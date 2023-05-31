import {
  COUNTRY_TYPES,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { fakeFile, setupTest } from './helpers';
import { petitionsClerkAddsPractitionerToPrimaryContact } from '../integration-tests/journey/petitionsClerkAddsPractitionerToPrimaryContact';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerSearchesForCase } from '../integration-tests/journey/practitionerSearchesForCase';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { unauthedUserSearchesByMeta } from './journey/unauthedUserSearchesByMeta';
import { unauthedUserViewsCaseDetail } from './journey/unauthedUserViewsCaseDetail';
import { unauthedUserViewsFilteredDocketRecord } from './journey/unauthedUserViewsFilteredDocketRecord';
import { unauthedUserViewsPrintableDocketRecord } from './journey/unauthedUserViewsPrintableDocketRecord';

describe('unauthed user views practitioner filed brief', () => {
  const cerebralTest = setupTest();
  const testClient = setupTestClient();
  const privatePractitioner1BarNumber = 'PT5432';

  const seriatimBriefDocument = {
    category: 'Seriatim Brief',
    documentTitle: 'Seriatim Answering Brief',
    documentType: 'Seriatim Answering Brief',
    eventCode: 'SEAB',
    scenario: 'Standard',
  };

  testClient.draftOrders = [];

  afterAll(() => {
    testClient.closeSocket();
  });

  describe('Petitioner creates case', () => {
    loginAs(testClient, 'petitioner@example.com');

    it('Create case', async () => {
      const caseDetail = await uploadPetition(testClient, {
        contactSecondary: {
          address1: '734 Cowley Parkway',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Aliens, Dude',
          phone: '+1 (884) 358-9729',
          postalCode: '77546',
          state: 'CT',
        },
        partyType: PARTY_TYPES.petitionerSpouse,
      });
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
      testClient.docketNumber = caseDetail.docketNumber;
    });
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);

  petitionsClerkAddsPractitionerToPrimaryContact(
    testClient,
    privatePractitioner1BarNumber,
  );

  describe('Petitioner creates case', () => {
    loginAs(testClient, 'privatePractitioner1@example.com');
    it('Practitioner files document for stipulated decision', async () => {
      await testClient.runSequence('gotoCaseDetailSequence', {
        docketNumber: testClient.docketNumber,
      });

      await testClient.runSequence('gotoFileDocumentSequence', {
        docketNumber: testClient.docketNumber,
      });

      for (const key of Object.keys(seriatimBriefDocument)) {
        await testClient.runSequence(
          'updateFileDocumentWizardFormValueSequence',
          {
            key,
            value: seriatimBriefDocument[key],
          },
        );
      }

      await testClient.runSequence('validateSelectDocumentTypeSequence');

      expect(testClient.getState('validationErrors')).toEqual({});

      await testClient.runSequence('completeDocumentSelectSequence');

      expect(testClient.getState('form.documentType')).toEqual(
        seriatimBriefDocument.documentType,
      );

      expect(testClient.getState('form.partyPrimary')).toEqual(undefined);

      await testClient.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: 'attachments',
          value: false,
        },
      );
      await testClient.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: 'objections',
          value: OBJECTIONS_OPTIONS_MAP.NO,
        },
      );

      await testClient.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: 'primaryDocumentFile',
          value: fakeFile,
        },
      );

      const contactPrimary = contactPrimaryFromState(testClient);

      await testClient.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: `filersMap.${contactPrimary.contactId}`,
          value: true,
        },
      );

      await testClient.runSequence('reviewExternalDocumentInformationSequence');

      expect(testClient.getState('validationErrors')).toEqual({});

      await testClient.runSequence('submitExternalDocumentSequence');
    });
  });

  // loginAs(testClient, 'privatePractitioner3@example.com');
  // practitionerSearchesForCase(testClient);
  // it('unassociated practitioner is able to view the previously filed seriatim brief and access the document link', async () => {
  //   let { formattedDocketEntriesOnDocketRecord } =
  //     await getFormattedDocketEntriesForTest(testClient);

  //   const practitioner1FiledSeriatimBrief =
  //     formattedDocketEntriesOnDocketRecord.find(
  //       entry => entry.eventCode === seriatimBriefDocument.eventCode,
  //     );

  //   expect(practitioner1FiledSeriatimBrief).toEqual('');
  // });

  // describe('Unauthed user searches for a case and views a case detail page', () => {
  //   unauthedUserNavigatesToPublicSite(cerebralTest);
  //   unauthedUserSearchesByMeta(cerebralTest);
  //   unauthedUserSearchesByDocketNumber(cerebralTest, testClient);
  //   unauthedUserViewsCaseDetail(cerebralTest);
  //   unauthedUserViewsFilteredDocketRecord(cerebralTest);
  //   unauthedUserViewsPrintableDocketRecord(cerebralTest);
  // });
});
