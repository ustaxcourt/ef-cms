import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
  waitForCondition,
} from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardD = cerebralTest => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard D scenario', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[0];
    const petitionDocument = getPetitionDocumentForCase(
      cerebralTest.getState('caseDetail'),
    );
    expect(docketEntryId).toBeDefined();
    expect(petitionDocument.docketEntryId).toBeDefined();

    const docketEntriesBefore = formattedDocketEntriesOnDocketRecord.length;

    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PaperFiling');
    expect(cerebralTest.getState('docketEntryId')).toEqual(docketEntryId);

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'CS',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
      serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[1],
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'serviceDate',
        toFormat: FORMATS.ISO,
        value: '5/5/2015',
      },
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: petitionDocument.docketEntryId,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest));

    const docketEntriesAfter = formattedDocketEntriesOnDocketRecord.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = formattedDocketEntriesOnDocketRecord[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay:
        'Certificate of Service of Petition 05-05-2015 some additional info (C/S 01/01/11) (Attachment(s)) (Lodged) some additional info pt 2',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Certificate of Service of Petition 05-05-2015',
      documentType: 'Certificate of Service',
      eventCode: 'MISCL',
      serviceDate: '2015-05-05T00:00:00.000-04:00',
    });
  });
};
