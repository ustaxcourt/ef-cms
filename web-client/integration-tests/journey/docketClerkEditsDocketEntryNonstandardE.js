import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardE = test => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard E scenario', async () => {
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
      value: 'M057',
    });

    await test.runSequence('fileDocketEntrySequence', {
      isSavingForLater: true,
    });

    expect(test.getState('validationErrors')).toEqual({
      trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Boise, Idaho',
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
      description:
        'Motion to Change Place of Hearing of Disclosure Case To Boise, Idaho some additional info',
    });

    const updatedDocument = caseDetailFormatted.documents.find(
      document => document.documentId === documentId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle:
        'Motion to Change Place of Hearing of Disclosure Case To Boise, Idaho',
      documentType: 'Motion to Change Place of Hearing of Disclosure Case',
      eventCode: 'MISCL',
    });
  });
};
