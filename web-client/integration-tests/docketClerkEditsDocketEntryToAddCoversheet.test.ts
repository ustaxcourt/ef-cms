import { FORMATS } from '@shared/business/utilities/DateHandler';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

/**
 * Spec (per coversheet-gaps/SPEC.md): a Court Issued document that does
 * NOT have a coversheet (e.g. a Transcript), once edited to a Court
 * Issued document type that DOES have a coversheet (e.g. Trial Exhibits),
 * gains a coversheet — page count goes from `fakeFile pages` to
 * `fakeFile pages + 1`. This is the symmetric counterpart to
 * docketClerkEditsDocketEntryToRemoveCoversheet.test.ts; without it the
 * shouldAddNewCoverSheet branch in updateDocketEntryMetaInteractor has no
 * end-to-end regression net.
 */
describe('docket clerk edits a docket entry to add a coversheet', () => {
  const cerebralTest = setupTest();

  const pdfUploadDescription = 'Some description on the uploaded order';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create an electronically filed case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');

  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');

  it('upload a court issued document and save as a draft document', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoUploadCourtIssuedDocumentSequence');

    const pdfUploadFormValues = {
      freeText: pdfUploadDescription,
      primaryDocumentFile: fakeFile,
    };

    for (const [key, value] of Object.entries(pdfUploadFormValues)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const { draftDocuments } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const uploadedCourtIssuedDraft = draftDocuments.find(
      doc => doc.documentTitle === pdfUploadDescription,
    );

    expect(uploadedCourtIssuedDraft).toBeTruthy();

    cerebralTest.docketEntryId = uploadedCourtIssuedDraft?.docketEntryId;
  });

  it('add a Transcript docket entry from the draft document (no coversheet)', async () => {
    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('CourtIssuedDocketEntry');

    // Transcript is a Type H court issued doc with no requiresCoversheet.
    const transcriptFormValues = {
      documentTitle: 'Transcript of [anything] on [date]',
      documentType: 'Transcript',
      eventCode: 'TRAN',
      scenario: 'Type H',
    };

    for (const [key, value] of Object.entries(transcriptFormValues)) {
      await cerebralTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'transcript description',
      },
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'date',
        toFormat: FORMATS.ISO,
        value: '4/4/2020',
      },
    );

    await cerebralTest.runSequence('updateCourtIssuedDocketEntryTitleSequence');

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'filingDate',
        toFormat: FORMATS.ISO,
        value: '4/4/2020',
      },
    );

    await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );
  });

  it('verify Transcript docket entry page count does NOT include a coversheet', async () => {
    const { docketEntries } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const transcriptDocketEntry = docketEntries.find(
      doc => doc.docketEntryId === cerebralTest.docketEntryId,
    );
    cerebralTest.index = transcriptDocketEntry?.index;

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(fakeFile);

    expect(transcriptDocketEntry?.numberOfPages).toEqual(pdfDoc.getPageCount());
  });

  it('go to edit Transcript docket entry', async () => {
    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex: cerebralTest.index,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');
  });

  it('edit Transcript docket entry, update to Trial Exhibits docket entry', async () => {
    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'TE',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Trial Exhibits',
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });
  });

  it('verify Trial Exhibits docket entry page count now includes the newly added coversheet', async () => {
    const { docketEntries } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const trialExhibitsDocketEntry = docketEntries.find(
      doc => doc.docketEntryId === cerebralTest.docketEntryId,
    );

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(fakeFile);

    expect(trialExhibitsDocketEntry?.numberOfPages).toEqual(
      pdfDoc.getPageCount() + 1,
    );
  });
});
