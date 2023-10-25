import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
  waitForCondition,
} from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardC = cerebralTest => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard C scenario', async () => {
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
      value: 'DCL',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Bob Barker',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: petitionDocument.docketEntryId,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'mailingDate',
      value: 'yesterday',
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo',
      value: 'some additional info',
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo2',
      value: 'some additional info pt 2',
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'addToCoversheet',
      value: true,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'attachments',
      value: true,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'certificateOfServiceDate',
        toFormat: FORMATS.ISO,
        value: '1/1/2011',
      },
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'pending',
      value: true,
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
        'Declaration of Bob Barker in Support of Petition some additional info (C/S 01/01/11) (Attachment(s)) (Lodged) some additional info pt 2',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      addToCoversheet: true,
      additionalInfo: 'some additional info',
      additionalInfo2: 'some additional info pt 2',
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDate: '2011-01-01T00:00:00.000-05:00',
      documentTitle: 'Declaration of Bob Barker in Support of Petition',
      documentType: 'Declaration in Support',
      eventCode: 'MISCL',
      lodged: true,
      mailingDate: 'yesterday',
      pending: true,
    });
  });
};
