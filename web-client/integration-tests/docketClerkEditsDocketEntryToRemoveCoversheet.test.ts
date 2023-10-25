import { FORMATS } from '@shared/business/utilities/DateHandler';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('docket clerk updates docket entries', () => {
  const cerebralTest = setupTest();

  const pdfUploadDescription = 'Abstraction is often one floor above you.';

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

    for (let [key, value] of Object.entries(pdfUploadFormValues)) {
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

    cerebralTest.docketEntryId = uploadedCourtIssuedDraft.docketEntryId;
  });

  it('add a Trial Exhibits docket entry from the draft document', async () => {
    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('CourtIssuedDocketEntry');

    const trialExhibitsFormValues = {
      documentType: 'Trial Exhibits',
      eventCode: 'TE', // Trial Exhibits, a coversheet will be added to the uploaded PDF
    };

    for (let [key, value] of Object.entries(trialExhibitsFormValues)) {
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
    cerebralTest.index = trialExhibitsDocketEntry.index;

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(fakeFile);

    expect(trialExhibitsDocketEntry.numberOfPages).toEqual(
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

  it('edit Trial Exhibits docket entry, update to Transcript docket entry', async () => {
    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'TRAN',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Transcript',
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

  it('verify Transcript docket entry page count does NOT include the coversheet that was removed', async () => {
    const { docketEntries } = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const trialExhibitsDocketEntry = docketEntries.find(
      doc => doc.docketEntryId === cerebralTest.docketEntryId,
    );
    cerebralTest.index = trialExhibitsDocketEntry.index;

    const { PDFDocument } = await cerebralTest.applicationContext.getPdfLib();
    const pdfDoc = await PDFDocument.load(fakeFile);

    expect(trialExhibitsDocketEntry.numberOfPages).toEqual(
      pdfDoc.getPageCount(),
    );
  });
});
