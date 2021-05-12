import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { getPetitionDocumentForCase } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsDocketEntryNonstandardH = test => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard H scenario', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    let helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const { docketEntryId } = helper.formattedDocketEntriesOnDocketRecord[0];
    const petitionDocument = getPetitionDocumentForCase(
      test.getState('caseDetail'),
    );
    expect(docketEntryId).toBeDefined();
    expect(petitionDocument.docketEntryId).toBeDefined();

    const docketEntriesBefore =
      helper.formattedDocketEntriesOnDocketRecord.length;

    await test.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('PaperFiling');
    expect(test.getState('docketEntryId')).toEqual(docketEntryId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'M115',
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      secondaryDocument: VALIDATION_ERROR_MESSAGES.secondaryDocument,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.YES,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'AMAT',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.ordinalValue',
      value: 'First',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.previousDocument',
      value: petitionDocument.docketEntryId,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({});

    helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: test.getState(),
    });

    const docketEntriesAfter =
      helper.formattedDocketEntriesOnDocketRecord.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = helper.formattedDocketEntriesOnDocketRecord[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay:
        'Motion for Leave to File First Amended Petition some additional info',
    });

    const updatedDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Motion for Leave to File First Amended Petition',
      documentType: 'Motion for Leave to File',
      eventCode: 'MISCL',
    });
  });
};
