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

    const { docketEntryId } = caseDetailFormatted.formattedDocketEntries[0];
    const petitionDocument = getPetitionDocumentForCase(
      test.getState('caseDetail'),
    );
    expect(docketEntryId).toBeDefined();
    expect(petitionDocument.docketEntryId).toBeDefined();

    const docketEntriesBefore =
      caseDetailFormatted.formattedDocketEntries.length;

    await test.runSequence('gotoCompleteDocketEntrySequence', {
      docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddDocketEntry');
    expect(test.getState('docketEntryId')).toEqual(docketEntryId);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'DCL',
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

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

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

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
      descriptionDisplay:
        'Declaration of Bob Barker in Support of Petition some additional info',
    });

    const updatedDocument = caseDetailFormatted.formattedDocketEntries.find(
      document => document.docketEntryId === docketEntryId,
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
