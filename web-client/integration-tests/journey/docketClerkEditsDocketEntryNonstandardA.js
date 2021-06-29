import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import {
  contactPrimaryFromState,
  contactSecondaryFromState,
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
} from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardA = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard A scenario', async () => {
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

    const contactPrimary = contactPrimaryFromState(test);
    const contactSecondary = contactSecondaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactSecondary.contactId}`,
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

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test));

    const docketEntriesAfter = formattedDocketEntriesOnDocketRecord.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = formattedDocketEntriesOnDocketRecord[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay: 'Notice of No Objection to Petition',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Notice of No Objection to Petition',
      documentType: 'Notice of No Objection',
      eventCode: 'NNOB',
      filedBy: 'Resp. & Petrs. Mona Schultz & Jimothy Schultz, Brianna Noble',
      filers: [contactPrimary.contactId, contactSecondary.contactId],
      partyIrsPractitioner: true,
      receivedAt: '2012-01-01T05:00:00.000Z',
    });
  });
};
