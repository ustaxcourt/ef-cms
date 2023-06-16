import {
  COUNTRY_TYPES,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { applicationContextPublic } from '../src/applicationContextPublic';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { docketClerkQCsDocketEntry } from '../integration-tests/journey/docketClerkQCsDocketEntry';
import { fakeFile, setupTest } from './helpers';
import { petitionsClerkAddsPractitionerToPrimaryContact } from '../integration-tests/journey/petitionsClerkAddsPractitionerToPrimaryContact';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerSearchesForCase } from '../integration-tests/journey/practitionerSearchesForCase';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesByDocketNumber } from './journey/unauthedUserSearchesByDocketNumber';
import { withAppContextDecorator } from '../src/withAppContext';

describe('unauthed user views practitioner filed brief', () => {
  const cerebralTest = setupTest();
  const testClient = setupTestClient();
  const privatePractitionerBarNumber = 'PT1234';

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );

  const seriatimBriefDocument = {
    category: 'Seriatim Brief',
    documentTitle: 'Seriatim Answering Brief',
    documentType: 'Seriatim Answering Brief',
    eventCode: 'SEAB',
    scenario: 'Standard',
  };

  const qcableSeriatimBriefDocument = {
    category: 'Seriatim Brief',
    documentTitle: 'Seriatim Opening Brief',
    documentType: 'Seriatim Opening Brief',
    eventCode: 'SEOB',
    scenario: 'Standard',
  };

  const servableBriefDocument = {
    category: 'Simultaneous Brief',
    documentTitle: 'Simultaneous Opening Brief',
    documentType: 'Simultaneous Opening Brief',
    eventCode: 'SIOB',
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

  describe('petitionsclerk serves petition and adds privatePractitioner to case', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    petitionsClerkServesElectronicCaseToIrs(testClient);

    petitionsClerkAddsPractitionerToPrimaryContact(
      testClient,
      privatePractitionerBarNumber,
    );
  });

  describe('privatePractitioner files a seriatim brief on the case', () => {
    loginAs(testClient, 'privatepractitioner@example.com');
    it('Practitioner files document for brief', async () => {
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

      await testClient.runSequence('updateFormValueSequence', {
        key: 'redactionAcknowledgement',
        value: true,
      });

      await testClient.runSequence('submitExternalDocumentSequence');
    });
  });

  describe('privatePractitioner3 searches for the case and views the seriatim brief document', () => {
    loginAs(testClient, 'privatepractitioner3@example.com');
    practitionerSearchesForCase(testClient);
    it('unassociated practitioner is able to view the previously filed seriatim brief and access the document link', async () => {
      let { formattedDocketEntriesOnDocketRecord } =
        await getFormattedDocketEntriesForTest(testClient);

      const practitioner1FiledSeriatimBrief =
        formattedDocketEntriesOnDocketRecord.find(
          entry => entry.eventCode === seriatimBriefDocument.eventCode,
        );

      expect(practitioner1FiledSeriatimBrief).toMatchObject({
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
      });
    });
  });

  describe('privatePractitioner files a servable simultaneous opening brief on the case', () => {
    loginAs(testClient, 'privatepractitioner@example.com');
    it('Practitioner files document for brief', async () => {
      await testClient.runSequence('gotoCaseDetailSequence', {
        docketNumber: testClient.docketNumber,
      });

      await testClient.runSequence('gotoFileDocumentSequence', {
        docketNumber: testClient.docketNumber,
      });

      for (const key of Object.keys(servableBriefDocument)) {
        await testClient.runSequence(
          'updateFileDocumentWizardFormValueSequence',
          {
            key,
            value: servableBriefDocument[key],
          },
        );
      }

      await testClient.runSequence('validateSelectDocumentTypeSequence');

      expect(testClient.getState('validationErrors')).toEqual({});

      await testClient.runSequence('completeDocumentSelectSequence');

      expect(testClient.getState('form.documentType')).toEqual(
        servableBriefDocument.documentType,
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

      await testClient.runSequence('updateFormValueSequence', {
        key: 'redactionAcknowledgement',
        value: true,
      });

      await testClient.runSequence('submitExternalDocumentSequence');
    });
  });

  describe('petitionsClerk serves the simultaneous opening brief', () => {
    loginAs(testClient, 'petitionsclerk@example.com');
    it('should serve the brief', async () => {
      let { formattedDocketEntriesOnDocketRecord } =
        await getFormattedDocketEntriesForTest(testClient);

      const simultaneousBrief = formattedDocketEntriesOnDocketRecord.find(
        doc => doc.eventCode === 'SIOB',
      );

      await testClient.runSequence(
        'openConfirmServePaperFiledDocumentSequence',
        {
          docketEntryId: simultaneousBrief.docketEntryId,
          redirectUrl: `/case-detail/${testClient.docketNumber}/document-view?docketEntryId=${simultaneousBrief.docketEntryId}`,
        },
      );

      expect(testClient.getState('modal.showModal')).toEqual(
        'ConfirmInitiatePaperFilingServiceModal',
      );

      await testClient.runSequence('servePaperFiledDocumentSequence');
    });
  });

  describe('privatePractitioner files a qcable seriatim opening brief on the case', () => {
    loginAs(testClient, 'privatepractitioner@example.com');
    it('Practitioner files document for brief', async () => {
      await testClient.runSequence('gotoCaseDetailSequence', {
        docketNumber: testClient.docketNumber,
      });

      await testClient.runSequence('gotoFileDocumentSequence', {
        docketNumber: testClient.docketNumber,
      });

      for (const key of Object.keys(qcableSeriatimBriefDocument)) {
        await testClient.runSequence(
          'updateFileDocumentWizardFormValueSequence',
          {
            key,
            value: qcableSeriatimBriefDocument[key],
          },
        );
      }

      await testClient.runSequence('validateSelectDocumentTypeSequence');

      expect(testClient.getState('validationErrors')).toEqual({});

      await testClient.runSequence('completeDocumentSelectSequence');

      expect(testClient.getState('form.documentType')).toEqual(
        qcableSeriatimBriefDocument.documentType,
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

      await testClient.runSequence('updateFormValueSequence', {
        key: 'redactionAcknowledgement',
        value: true,
      });

      await testClient.runSequence('submitExternalDocumentSequence');
    });
  });

  describe('docketClerk qcs the seriatim opening brief', () => {
    loginAs(testClient, 'docketclerk@example.com');
    docketClerkQCsDocketEntry(testClient);
  });

  describe('Unauthed user searches for a case and views a case detail page', () => {
    unauthedUserNavigatesToPublicSite(cerebralTest);
    unauthedUserSearchesByDocketNumber(cerebralTest, testClient);
    it('unauthed user is able to view the practitioner filed briefs', async () => {
      await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      let { formattedDocketEntriesOnDocketRecord } = runCompute(
        publicCaseDetailHelper,
        {
          state: cerebralTest.getState(),
        },
      );

      const practitioner1FiledSeriatimBrief =
        formattedDocketEntriesOnDocketRecord.find(
          entry => entry.eventCode === seriatimBriefDocument.eventCode,
        );

      const practitioner1FiledServedBrief =
        formattedDocketEntriesOnDocketRecord.find(
          entry => entry.eventCode === servableBriefDocument.eventCode,
        );

      const practitioner1FiledQcableBrief =
        formattedDocketEntriesOnDocketRecord.find(
          entry => entry.eventCode === qcableSeriatimBriefDocument.eventCode,
        );

      expect(practitioner1FiledSeriatimBrief).toMatchObject({
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
      });
      expect(practitioner1FiledServedBrief).toMatchObject({
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
      });
      expect(practitioner1FiledQcableBrief).toMatchObject({
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
      });
    });
  });
});
