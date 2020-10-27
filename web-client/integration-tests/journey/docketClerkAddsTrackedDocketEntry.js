import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';

export const docketClerkAddsTrackedDocketEntry = (test, fakeFile) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

  return it('Docketclerk adds tracked paper filing', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toMatchObject({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      partyPrimary: VALIDATION_ERROR_MESSAGES.partyPrimary,
      primaryDocumentFile:
        'Scan or upload a document to serve, or click Save for Later to serve at a later time',
    });

    // primary document
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'partyPrimary',
      value: true,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'APPL',
    });

    expect(test.getState('form.documentType')).toEqual('Application');

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Application for Flavortown',
    });

    await test.runSequence('fileDocketEntrySequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('form')).toEqual({});

    expect(test.getState('caseDetail.hasPendingItems')).toEqual(true);
    expect(test.getState('caseDetail.automaticBlocked')).toEqual(true);
  });
};
