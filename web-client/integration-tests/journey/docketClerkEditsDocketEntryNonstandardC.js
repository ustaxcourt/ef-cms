import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { getPetitionDocumentForCase } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardC = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard C scenario', async () => {
    let caseDetailFormatted;
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const { documentId } = caseDetailFormatted.formattedDocketEntries[0];
    const petitionDocument = getPetitionDocumentForCase(
      test.getState('caseDetail'),
    );
    expect(documentId).toBeDefined();
    expect(petitionDocument.documentId).toBeDefined();

    const docketEntriesBefore =
      caseDetailFormatted.formattedDocketEntries.length;

    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('documentId')).toEqual(documentId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'DCL',
    });

    await test.runSequence('saveForLaterDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText,
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Bob Barker',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: petitionDocument.documentId,
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

    await test.runSequence('saveForLaterDocketEntrySequence');

    expect(test.getState('validationErrors')).toEqual({});

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const docketEntriesAfter =
      caseDetailFormatted.formattedDocketEntries.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = caseDetailFormatted.formattedDocketEntries[0];
    expect(updatedDocketEntry).toMatchObject({
      description:
        'Declaration of Bob Barker in Support of Petition some additional info',
    });

    const updatedDocument = caseDetailFormatted.documents.find(
      document => document.documentId === documentId,
    );
    expect(updatedDocument).toMatchObject({
      addToCoversheet: true,
      additionalInfo: 'some additional info',
      additionalInfo2: 'some additional info pt 2',
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDate: '2011-01-01',
      documentTitle: 'Declaration of Bob Barker in Support of Petition',
      documentType: 'Declaration in Support',
      eventCode: 'MISCL',
      lodged: true,
      mailingDate: 'yesterday',
      pending: true,
    });
  });
};
