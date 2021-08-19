import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { getFormattedDocketEntriesForTest } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardE = cerebralTest => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard E scenario', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[0];
    expect(docketEntryId).toBeDefined();

    const docketEntriesBefore = formattedDocketEntriesOnDocketRecord.length;

    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PaperFiling');
    expect(cerebralTest.getState('docketEntryId')).toEqual(docketEntryId);

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'M057',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Boise, Idaho',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest));

    const docketEntriesAfter = formattedDocketEntriesOnDocketRecord.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = formattedDocketEntriesOnDocketRecord[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay:
        'Motion to Change Place of Hearing of Disclosure Case To Boise, Idaho some additional info',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle:
        'Motion to Change Place of Hearing of Disclosure Case To Boise, Idaho',
      documentType: 'Motion to Change Place of Hearing of Disclosure Case',
      eventCode: 'MISCL',
    });
  });
};
