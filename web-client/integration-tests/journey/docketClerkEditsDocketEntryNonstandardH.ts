import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
  waitForCondition,
} from '../helpers';

export const docketClerkEditsDocketEntryNonstandardH = cerebralTest => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard H scenario', async () => {
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
      value: 'M115',
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      secondaryDocument: 'Select a document',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.YES,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'AMAT',
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.ordinalValue',
      value: '1',
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.previousDocument',
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
        'Motion for Leave to File First Amended Petition some additional info (C/S 01/01/11) (Attachment(s)) (Objection) (Lodged) some additional info pt 2',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Motion for Leave to File First Amended Petition',
      documentType: 'Motion for Leave to File',
      eventCode: 'MISCL',
    });
  });
};
