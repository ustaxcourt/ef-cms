import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { getFormattedDocketEntriesForTest } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardG = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard G scenario', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[0];
    expect(docketEntryId).toBeDefined();

    const docketEntriesBefore = formattedDocketEntriesOnDocketRecord.length;

    await test.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('PaperFiling');
    expect(test.getState('docketEntryId')).toEqual(docketEntryId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'REQA',
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'ordinalValue',
      value: 'First',
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
      descriptionDisplay: 'First Request for Admissions some additional info',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'First Request for Admissions',
      documentType: 'Request for Admissions',
      eventCode: 'MISCL',
    });
  });
};
