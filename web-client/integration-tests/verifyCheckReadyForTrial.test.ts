import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  wait,
  waitForCondition,
} from './helpers';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import axios from 'axios';

describe('Invoke checkForReadyForTrialCasesLambda via http request', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  [
    {
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
    },
    {
      documentTitle: 'Answer to Third Amended Petition',
      documentType: 'Answer to Third Amended Petition',
      eventCode: 'ASAP',
    },
    {
      documentTitle: 'Answer to Amendment to Petition',
      documentType: 'Answer to Amendment to Petition',
      eventCode: 'AATP',
    },
  ].forEach(document => {
    loginAs(cerebralTest, 'petitioner@example.com');
    it('create case', async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkServesPetitionFromDocumentView(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    it('docket clerk creates a paper-filed answer docket entry', async () => {
      await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key: 'eventCode',
        value: document.eventCode,
      });

      await cerebralTest.runSequence(
        'formatAndUpdateDateFromDatePickerSequence',
        {
          key: 'receivedAt',
          toFormat: FORMATS.ISO,
          value: '1/1/2018',
        },
      );

      await cerebralTest.runSequence('setDocumentForUploadSequence', {
        documentType: 'primaryDocumentFile',
        documentUploadMode: 'preview',
        file: fakeFile,
      });

      const { contactId } = contactPrimaryFromState(cerebralTest);
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key: `filersMap.${contactId}`,
          value: true,
        },
      );

      await cerebralTest.runSequence('submitPaperFilingSequence', {
        isSavingForLater: false,
      });

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'CaseDetailInternal',
      });

      const caseDocument = cerebralTest.getState('caseDetail.docketEntries.0');
      expect(caseDocument).toMatchObject({
        documentTitle: document.documentTitle,
        documentType: document.documentType,
        eventCode: document.eventCode,
        isFileAttached: true,
      });
      expect(cerebralTest.getState('validationErrors')).toEqual({});
      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const caseDetail = cerebralTest.getState('caseDetail');
      expect(caseDetail).toMatchObject({
        status: 'General Docket - Not at Issue',
      });
      cerebralTest.docketEntryId = caseDocument.docketEntryId;
    });

    it('invoke the lambda', async () => {
      await refreshElasticsearchIndex();
      await axios.get('http://localhost:4000/run-check-ready-for-trial');
      await wait(4000);
    });

    it('docket clerk verifies that case status is `General Docket - At Issue (Ready for Trial)`', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      const caseDetail = cerebralTest.getState('caseDetail');
      expect(caseDetail).toMatchObject({
        status: 'General Docket - At Issue (Ready for Trial)',
      });
    });
  });
});
