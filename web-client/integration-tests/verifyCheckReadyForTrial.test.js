import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import axios from 'axios';

const cerebralTest = setupTest();

describe('Invoke checkForReadyForTrialCasesLambda via http request', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

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

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: false,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = cerebralTest.getState('caseDetail.docketEntries.0');
    expect(caseDocument).toMatchObject({
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
      isFileAttached: true,
    });

    const caseDetail = cerebralTest.getState('caseDetail');
    expect(caseDetail).toMatchObject({
      status: 'General Docket - Not at Issue',
    });
    cerebralTest.docketEntryId = caseDocument.docketEntryId;
  });

  it('invoke the lambda', async () => {
    await refreshElasticsearchIndex();
    await axios.get('http://localhost:4000/run-check-ready-for-trial');
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
