import { FORMATS } from '@shared/business/utilities/DateHandler';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

/**
 * Spec (per coversheet-gaps/SPEC.md): a Court Issued document that has a
 * coversheet (e.g. Trial Exhibits) edited to another Court Issued doc
 * type that also has a coversheet (e.g. U.S.C.A.) → a NEW coversheet is
 * APPENDED on top of the original (original coversheet is preserved).
 *
 * This is the only Edit Docket Entry transition that disambiguates
 * append-vs-replace coversheet semantics — without this test, a
 * regression that flips updateDocketEntryMetaInteractor to pass
 * `replaceCoversheet: true` would silently pass. Page count goes from
 * `fakeFile pages + 1` (original + 1 coversheet) to `fakeFile pages + 2`
 * (original + original coversheet + new coversheet).
 */
describe('docket clerk edits a docket entry to append a new coversheet', () => {
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

  it('add a Trial Exhibits docket entry from the draft document', async () => {
    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('CourtIssuedDocketEntry');

    const trialExhibitsFormValues = {
      documentType: 'Trial Exhibits',
      eventCode: 'TE', // requiresCoversheet: true
    };

    for (const [key, value] of Object.entries(trialExhibitsFormValues)) {
      await cerebralTest.runSequence('updateFormValueSequence', {
        key,
        value,
      });
    }

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

  it('verify Trial Exhibits docket entry page count includes the coversheet', async () => {
    const { docketEntries } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const trialExhibitsDocketEntry = docketEntries.find(
      doc => doc.docketEntryId === cerebralTest.docketEntryId,
    );
    cerebralTest.index = trialExhibitsDocketEntry?.index;

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(fakeFile);

    expect(trialExhibitsDocketEntry?.numberOfPages).toEqual(
      pdfDoc.getPageCount() + 1,
    );
  });

  it('go to edit Trial Exhibits docket entry', async () => {
    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex: cerebralTest.index,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');
  });

  it('edit Trial Exhibits docket entry, update to U.S.C.A. docket entry (also requires coversheet)', async () => {
    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'USCA',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'U.S.C.A',
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

  it('verify U.S.C.A. docket entry page count includes BOTH the original coversheet AND a newly appended coversheet', async () => {
    const { docketEntries } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const updatedDocketEntry = docketEntries.find(
      doc => doc.docketEntryId === cerebralTest.docketEntryId,
    );

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(fakeFile);

    // Append-not-replace regression signal: a regression that drops the
    // original coversheet (replaceCoversheet: true) would land at
    // pdfDoc.getPageCount() + 1; a regression that skips regen entirely
    // would also land at pdfDoc.getPageCount() + 1.
    expect(updatedDocketEntry?.numberOfPages).toEqual(
      pdfDoc.getPageCount() + 2,
    );
  });
});
