import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { getPetitionDocumentForCase } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardA = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard A scenario', async () => {
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

    expect(test.getState('form')).toMatchObject({
      dateReceivedDay: '1',
      dateReceivedMonth: '1',
      dateReceivedYear: '2018',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'NNOB',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: '1',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: '1',
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: '2050',
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[0].message,
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: '2012',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: petitionDocument.docketEntryId,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partySecondary',
      value: true,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyIrsPractitioner',
      value: true,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'hasOtherFilingParty',
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      otherFilingParty: 'Enter other filing party name.',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'otherFilingParty',
      value: 'Brianna Noble',
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
      descriptionDisplay: 'Notice of No Objection to Petition',
    });

    const updatedDocument = helper.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Notice of No Objection to Petition',
      documentType: 'Notice of No Objection',
      eventCode: 'NNOB',
      filedBy: 'Resp. & Petrs. Mona Schultz & Jimothy Schultz, Brianna Noble',
      partyIrsPractitioner: true,
      partyPrimary: true,
      partySecondary: true,
      receivedAt: '2012-01-01T05:00:00.000Z',
    });
  });
};
