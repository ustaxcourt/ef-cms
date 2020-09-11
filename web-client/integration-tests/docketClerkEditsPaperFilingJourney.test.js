import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('Docket Clerk edits a paper filing journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  it('create a paper-filed docket entry', async () => {
    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'eventCode',
      'documentType',
      'partyPrimary',
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

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = test.getState('caseDetail.docketEntries.0');
    expect(caseDocument).toMatchObject({
      documentType: 'Answer',
      eventCode: 'A',
      isFileAttached: true,
    });
    test.docketEntryId = caseDocument.docketEntryId;
  });

  it('edit paper-filed docket entry, replacing PDF', async () => {
    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
    expect(test.getState('currentViewMetadata.documentUploadMode')).toEqual(
      'preview',
    );

    await test.runSequence('removeScannedPdfSequence');

    expect(test.getState('currentViewMetadata.documentUploadMode')).toEqual(
      'scan',
    );

    await test.runSequence('fileDocketEntrySequence');

    expect(Object.keys(test.getState('validationErrors'))).toEqual([
      'primaryDocumentFile',
    ]);

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
    expect(test.getState('form.primaryDocumentFile')).toBeDefined();
    expect(test.getState('currentViewMetadata.documentUploadMode')).toEqual(
      'preview',
    );

    await test.runSequence('fileDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });
});
