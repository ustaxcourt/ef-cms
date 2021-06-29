import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
} from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardC = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard C scenario', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[0];
    const petitionDocument = getPetitionDocumentForCase(
      test.getState('caseDetail'),
    );
    expect(docketEntryId).toBeDefined();
    expect(petitionDocument.docketEntryId).toBeDefined();

    const docketEntriesBefore = formattedDocketEntriesOnDocketRecord.length;

    await test.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('PaperFiling');
    expect(test.getState('docketEntryId')).toEqual(docketEntryId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'DCL',
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Bob Barker',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: petitionDocument.docketEntryId,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'mailingDate',
      value: 'yesterday',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo',
      value: 'some additional info',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'additionalInfo2',
      value: 'some additional info pt 2',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'addToCoversheet',
      value: true,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'attachments',
      value: true,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '1',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '1',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2011',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'pending',
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test));

    const docketEntriesAfter = formattedDocketEntriesOnDocketRecord.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = formattedDocketEntriesOnDocketRecord[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay:
        'Declaration of Bob Barker in Support of Petition some additional info',
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
      certificateOfServiceDate: '2011-01-01T05:00:00.000Z',
      documentTitle: 'Declaration of Bob Barker in Support of Petition',
      documentType: 'Declaration in Support',
      eventCode: 'MISCL',
      lodged: true,
      mailingDate: 'yesterday',
      pending: true,
    });
  });
};
