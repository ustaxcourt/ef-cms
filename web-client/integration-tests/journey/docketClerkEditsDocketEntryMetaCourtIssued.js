import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

export const docketClerkEditsDocketEntryMetaCourtIssued = test => {
  return it('docket clerk edits docket entry meta for a court-issued document', async () => {
    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'OAP',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Order for Amended Petition',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: 'Order for Amended Petition on [Date] [Anything]',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'scenario',
      value: 'Type D',
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'be free',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      caseId: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[2],
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'month',
      value: '4',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'day',
      value: '4',
    });
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: '2020',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      caseId: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[0].message,
    });

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'year',
      value: '2050',
    });

    await test.runSequence('submitEditDocketEntryMetaSequence', {
      caseId: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });
  });
};
