import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardG = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard G scenario', async () => {
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
    expect(documentId).toBeDefined();

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
      value: 'REQA',
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'ordinalValue',
      value: 'First',
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
      description: 'First Request for Admissions some additional info',
    });

    const updatedDocument = caseDetailFormatted.documents.find(
      document => document.documentId === documentId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'First Request for Admissions',
      documentType: 'Request for Admissions',
      eventCode: 'MISCL',
    });
  });
};
