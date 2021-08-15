import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';
import { docketClerkAddsMiscellaneousPaperFiling } from './journey/docketClerkAddsMiscellaneousPaperFiling';
const cerebralTest = setupTest();

describe('Docket Clerk edits a paper filing journey', () => {
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

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('create a paper-filed docket entry', async () => {
    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'eventCode',
      'documentType',
      'filers',
    ];

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

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

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
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
      isSavingForLater: true,
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
    cerebralTest.docketEntryId = caseDocument.docketEntryId;
  });

  it('open modal to serve paper-filed document (but do not serve)', async () => {
    const caseDocument = cerebralTest.getState('caseDetail.docketEntries.0');

    await cerebralTest.runSequence(
      'changeTabAndSetViewerDocumentToDisplaySequence',
      {
        docketRecordTab: 'documentView',
        viewerDocumentToDisplay: caseDocument,
      },
    );

    await cerebralTest.runSequence(
      'openConfirmServePaperFiledDocumentSequence',
      {
        docketEntryId: cerebralTest.docketEntryId,
      },
    );

    expect(
      cerebralTest.getState('viewerDocumentToDisplay.documentTitle'),
    ).toBeDefined();
  });

  it('edit paper-filed docket entry, replacing PDF', async () => {
    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PaperFiling');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
    expect(
      cerebralTest.getState('currentViewMetadata.documentUploadMode'),
    ).toEqual('preview');

    await cerebralTest.runSequence('removeScannedPdfSequence');
    await wait(200);

    expect(
      cerebralTest.getState('currentViewMetadata.documentUploadMode'),
    ).toEqual('scan');

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual([
      'primaryDocumentFile',
    ]);

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PaperFiling');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
    expect(cerebralTest.getState('form.primaryDocumentFile')).toBeDefined();
    expect(
      cerebralTest.getState('currentViewMetadata.documentUploadMode'),
    ).toEqual('preview');

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
  });

  docketClerkAddsMiscellaneousPaperFiling(cerebralTest, fakeFile);
});
