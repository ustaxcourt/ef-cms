import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';
import { docketClerkAddsMiscellaneousPaperFiling } from './journey/docketClerkAddsMiscellaneousPaperFiling';
const test = setupTest();

describe('Docket Clerk edits a paper filing journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  it('create a paper-filed docket entry', async () => {
    await test.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'eventCode',
      'documentType',
      'filers',
    ];

    expect(Object.keys(test.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(Object.keys(test.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = test.getState('caseDetail.docketEntries.0');
    expect(caseDocument).toMatchObject({
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
      isFileAttached: true,
    });
    test.docketEntryId = caseDocument.docketEntryId;
  });

  it('open modal to serve paper-filed document (but do not serve)', async () => {
    const caseDocument = test.getState('caseDetail.docketEntries.0');

    await test.runSequence('changeTabAndSetViewerDocumentToDisplaySequence', {
      docketRecordTab: 'documentView',
      viewerDocumentToDisplay: caseDocument,
    });

    await test.runSequence('openConfirmServePaperFiledDocumentSequence', {
      docketEntryId: test.docketEntryId,
    });

    expect(
      test.getState('viewerDocumentToDisplay.documentTitle'),
    ).toBeDefined();
  });

  it('edit paper-filed docket entry, replacing PDF', async () => {
    await test.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('PaperFiling');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
    expect(test.getState('currentViewMetadata.documentUploadMode')).toEqual(
      'preview',
    );

    await test.runSequence('removeScannedPdfSequence');
    await wait(200);

    expect(test.getState('currentViewMetadata.documentUploadMode')).toEqual(
      'scan',
    );

    await test.runSequence('submitPaperFilingSequence');

    expect(Object.keys(test.getState('validationErrors'))).toEqual([
      'primaryDocumentFile',
    ]);

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('currentPage')).toEqual('PaperFiling');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
    expect(test.getState('form.primaryDocumentFile')).toBeDefined();
    expect(test.getState('currentViewMetadata.documentUploadMode')).toEqual(
      'preview',
    );

    await test.runSequence('submitPaperFilingSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });

  docketClerkAddsMiscellaneousPaperFiling(test, fakeFile);
});
